import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteOrderFiles } from "@/lib/s3";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const userId = (session.user as unknown as { id: string }).id;

    // Получаем заказы пользователя для удаления файлов из S3
    const orders = await db.order.findMany({
      where: { userId },
    });

    // Удаляем файлы из S3
    for (const order of orders) {
      try {
        await deleteOrderFiles(order.originalFile, order.resultFile);
      } catch (err) {
        console.error("Failed to delete S3 files for order:", order.id, err);
      }
    }

    // Удаляем заказы (cascade удалит автоматически при удалении пользователя,
    // но удаляем явно для надёжности)
    await db.order.deleteMany({
      where: { userId },
    });

    // Удаляем пользователя
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "Аккаунт и все связанные данные удалены" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении аккаунта" },
      { status: 500 }
    );
  }
}
