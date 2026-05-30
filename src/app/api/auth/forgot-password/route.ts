import { NextResponse } from "next/server";
import { createToken } from "@/lib/tokens";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Некорректный формат email" },
        { status: 400 }
      );
    }

    // Create reset token
    const token = await createToken(email);

    // Build reset link
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    // Send reset email
    const emailSent = await sendMail(
      email,
      "Восстановление пароля — Понятно Смета",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Восстановление пароля</h2>
          <p>Вы запросили восстановление пароля на сервисе <strong>Понятно Смета</strong>.</p>
          <p>Для установки нового пароля перейдите по ссылке:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Сбросить пароль
          </a>
          <p style="color: #6b7280; font-size: 14px;">Ссылка действительна 1 час. Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
        </div>
      `
    );

    if (!emailSent) {
      console.warn(
        "Failed to send reset email for",
        email
      );
    }

    // Always return success to avoid leaking whether email exists
    return NextResponse.json(
      { message: "Если аккаунт существует, письмо для сброса пароля отправлено" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Ошибка при обработке запроса" },
      { status: 500 }
    );
  }
}
