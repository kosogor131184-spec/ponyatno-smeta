import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { validateToken, deleteToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Токен и новый пароль обязательны" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть не менее 6 символов" },
        { status: 400 }
      );
    }

    // Validate token
    const email = await validateToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "Токен недействителен или истёк" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete used token
    await deleteToken(token);

    return NextResponse.json(
      { message: "Пароль успешно обновлён" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Ошибка при сбросе пароля" },
      { status: 500 }
    );
  }
}
