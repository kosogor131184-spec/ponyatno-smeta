import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDownloadUrl } from "@/lib/s3";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const type = searchParams.get("type") || "result"; // "result" | "original"

    if (!orderId) {
      return NextResponse.json(
        { error: "Укажите orderId" },
        { status: 400 }
      );
    }

    // Проверяем авторизацию
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const userId = (session.user as unknown as { id: string }).id;
    const userRole = (session.user as unknown as { role: string }).role;

    // Находим заказ
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Заказ не найден" },
        { status: 404 }
      );
    }

    // Проверяем права доступа (админ или владелец заказа)
    if (userRole !== "admin" && order.userId !== userId) {
      return NextResponse.json(
        { error: "Доступ запрещён" },
        { status: 403 }
      );
    }

    // Определяем ключ файла
    const s3Key = type === "original" ? order.originalFile : order.resultFile;

    if (!s3Key) {
      return NextResponse.json(
        { error: "Файл не найден" },
        { status: 404 }
      );
    }

    // Генерируем подписанную ссылку для скачивания
    const downloadUrl = await getDownloadUrl(s3Key);

    return NextResponse.json({ downloadUrl }, { status: 200 });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении ссылки на скачивание" },
      { status: 500 }
    );
  }
}
