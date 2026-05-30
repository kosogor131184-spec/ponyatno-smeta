import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadOriginal } from "@/lib/s3";
import { sendMail, notifyAdmin } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const deliveryMethod = formData.get("deliveryMethod") as string;
    const guestEmail = formData.get("guestEmail") as string | null;
    const guestPhone = formData.get("guestPhone") as string | null;
    const consentGiven = formData.get("consentGiven") === "true";

    // Валидация
    if (!file) {
      return NextResponse.json(
        { error: "Файл обязателен" },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: "Необходимо согласие на обработку персональных данных" },
        { status: 400 }
      );
    }

    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    let isFree = false;

    if (session?.user) {
      userId = (session.user as unknown as { id: string }).id;

      // Проверяем, использована ли бесплатная смета
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (user && !user.freeUsed) {
        isFree = true;
      }
    } else {
      // Гость должен указать контакт
      if (!guestEmail && !guestPhone) {
        return NextResponse.json(
          { error: "Укажите email или телефон для получения результата" },
          { status: 400 }
        );
      }
    }

    // Создаём заказ в БД
    const order = await db.order.create({
      data: {
        userId,
        guestEmail: guestEmail || null,
        guestPhone: guestPhone || null,
        deliveryMethod: deliveryMethod || "cabinet",
        originalFile: "pending", // временно, обновим после загрузки в S3
        originalName: file.name,
        status: "pending",
        isFree,
        consentGiven: true,
      },
    });

    // Загружаем файл в S3
    const s3Key = await uploadOriginal(file, order.id);

    // Обновляем заказ с S3 ключом
    await db.order.update({
      where: { id: order.id },
      data: { originalFile: s3Key },
    });

    // Отмечаем бесплатную смету как использованную
    if (isFree && userId) {
      await db.user.update({
        where: { id: userId },
        data: { freeUsed: true },
      });
    }

    // Уведомляем админа о новом заказе
    const customerContact =
      session?.user?.email || guestEmail || guestPhone || "не указан";
    const deliveryLabel =
      deliveryMethod === "email"
        ? "Email"
        : deliveryMethod === "whatsapp"
        ? "WhatsApp"
        : deliveryMethod === "telegram"
        ? "Telegram"
        : "Личный кабинет";

    await notifyAdmin(
      `Новый заказ #${order.id.slice(0, 8)} — Понятно Смета`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">📦 Новый заказ на обработку сметы!</h2>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">ID заказа</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.id}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Файл</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${file.name} (${(file.size / 1024).toFixed(1)} КБ)</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Клиент</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${customerContact}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Способ доставки</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${deliveryLabel}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Бесплатная смета</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${isFree ? "Да" : "Нет"}</td></tr>
          </table>
          <p>Перейдите в <a href="${process.env.NEXTAUTH_URL}/admin" style="color: #d97706;">панель администратора</a>, чтобы обработать заказ.</p>
        </div>
      `
    );

    // Подтверждение клиенту (если email указан)
    const clientEmail = session?.user?.email || guestEmail;
    if (clientEmail) {
      await sendMail(
        clientEmail,
        `Заказ принят — Понятно Смета`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">✅ Ваш заказ принят!</h2>
            <p>Мы получили вашу смету <strong>${file.name}</strong> и начали обработку.</p>
            <p>Обычно результат готов в течение нескольких часов. Вы получите уведомление, когда смета будет обработана.</p>
            ${
              session?.user
                ? `<p><a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Перейти в личный кабинет</a></p>`
                : ""
            }
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Спасибо, что выбрали Понятно Смета!</p>
          </div>
        `
      );
    }

    return NextResponse.json(
      {
        message: "Заказ успешно создан",
        orderId: order.id,
        isFree,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload order error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}
