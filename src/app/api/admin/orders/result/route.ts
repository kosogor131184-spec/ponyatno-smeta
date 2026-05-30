import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadResult, getDownloadUrl } from "@/lib/s3";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    // Проверка прав администратора
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const userRole = (session.user as unknown as { role: string }).role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Доступ запрещён" },
        { status: 403 }
      );
    }

    // Парсим multipart form data
    const formData = await request.formData();

    const orderId = formData.get("orderId") as string | null;
    const file = formData.get("file") as File | null;

    if (!orderId) {
      return NextResponse.json(
        { error: "ID заказа обязателен" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "Файл результата обязателен" },
        { status: 400 }
      );
    }

    // Находим заказ
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Заказ не найден" },
        { status: 404 }
      );
    }

    // Загружаем файл результата в S3
    const s3Key = await uploadResult(file, orderId);

    // Обновляем заказ
    await db.order.update({
      where: { id: orderId },
      data: {
        status: "completed",
        resultFile: s3Key,
        resultName: file.name,
        completedAt: new Date(),
      },
    });

    // Генерируем ссылку для скачивания
    const downloadUrl = await getDownloadUrl(s3Key);

    // Определяем email клиента
    const customerEmail = order.user?.email || order.guestEmail;

    if (customerEmail) {
      const baseUrl = process.env.NEXTAUTH_URL || "https://понятносмета.рф";

      await sendMail(
        customerEmail,
        `Смета обработана — Понятно Смета`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">🎉 Ваша смета обработана!</h2>
            <p>Результат обработки вашей сметы готов.</p>
            <p><strong>Файл:</strong> ${file.name}</p>
            <p><strong>Заказ:</strong> #${order.id.slice(0, 8)}</p>
            <p>Вы можете скачать результат в личном кабинете или по ссылке ниже.</p>
            <div style="margin: 16px 0;">
              <a href="${downloadUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; margin-right: 8px;">
                📥 Скачать результат
              </a>
              ${
                order.userId
                  ? `<a href="${baseUrl}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 6px;">
                Личный кабинет
              </a>`
                  : ""
              }
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Ссылка для скачивания действительна 1 час. Если ссылка устарела — войдите в личный кабинет.</p>
            <p style="color: #6b7280; font-size: 14px;">Спасибо, что выбрали Понятно Смета!</p>
          </div>
        `
      );
    }

    return NextResponse.json(
      {
        message: "Результат загружен, заказ обновлён",
        orderId,
        downloadUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload result error:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке результата" },
      { status: 500 }
    );
  }
}
