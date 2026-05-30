import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDownloadUrl } from "@/lib/s3";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const userRole = (session.user as unknown as { role: string }).role;
    const userId = (session.user as unknown as { id: string }).id;

    let orders;

    if (userRole === "admin") {
      // Админ видит все заказы
      orders = await db.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });
    } else {
      // Обычный пользователь — только свои
      orders = await db.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    }

    // Добавляем presigned URLs для скачивания
    const ordersWithUrls = await Promise.all(
      orders.map(async (order) => {
        let resultUrl = null;

        if (order.status === "completed" && order.resultFile) {
          try {
            resultUrl = await getDownloadUrl(order.resultFile);
          } catch {
            // Если файл не найден в S3 — пропускаем
          }
        }

        return {
          id: order.id,
          createdAt: order.createdAt.toISOString(),
          filename: order.originalName,
          status: order.status,
          resultUrl,
          resultName: order.resultName,
          // Доп. поля для админа
          userEmail: order.user?.email || null,
          guestEmail: order.guestEmail || null,
          guestPhone: order.guestPhone || null,
          deliveryMethod: order.deliveryMethod,
          isFree: order.isFree,
          rowCount: order.rowCount,
        };
      })
    );

    return NextResponse.json({ orders: ordersWithUrls }, { status: 200 });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказов" },
      { status: 500 }
    );
  }
}
