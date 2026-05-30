import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// GET — проверка подключения к БД
export async function GET() {
  try {
    const userCount = await db.user.count();
    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
    });
  } catch (error) {
    console.error("DB check error:", error);
    return NextResponse.json({
      status: "error",
      database: "failed",
      error: String(error),
    }, { status: 500 });
  }
}

// POST — создание администратора
export async function POST(request: Request) {
  try {
    const existingAdmin = await db.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Администратор уже существует", email: existingAdmin.email },
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

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await db.user.update({
        where: { email },
        data: { role: "admin" },
      });
      return NextResponse.json(
        { message: `Пользователь ${email} теперь администратор` },
        { status: 200 }
      );
    }

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
      { error: "Ошибка при создании администратора", details: String(error) },
      { status: 500 }
    );
  }
}