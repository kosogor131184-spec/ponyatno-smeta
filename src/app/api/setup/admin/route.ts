import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// API маршрут для создания первого администратора
// Можно вызвать один раз: POST /api/setup/admin
// После создания админа этот маршрут следует удалить или защитить

export async function POST(request: Request) {
  try {
    // Проверяем, есть ли уже админ
    const existingAdmin = await db.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Администратор уже существует. Удалите этот маршрут." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Обновляем роль на admin
      await db.user.update({
        where: { email },
        data: { role: "admin" },
      });
      return NextResponse.json(
        { message: `Пользователь ${email} теперь администратор` },
        { status: 200 }
      );
    }

    // Создаём нового админа
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await db.user.create({
      data: {
        email,
        passwordHash,
        name: "Администратор",
        role: "admin",
      },
    });

    return NextResponse.json(
      {
        message: "Администратор создан",
        admin: { id: admin.id, email: admin.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup admin error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании администратора" },
      { status: 500 }
    );
  }
}
