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

    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Доступ запрещён" },
        { status: 403 }
      );
    }

    const orders = await db.order.findMany({
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

    // Добавляем ссылки на скачивание
    const ordersWithUrls = await Promise.all(
      orders.map(async (order) => {
        let resultUrl = null;
        let originalUrl = null;

        if (order.originalFile) {
          try {
            originalUrl = await getDownloadUrl(order.originalFile);
          } catch {
            // пропускаем
          }
        }

        if (order.status === "completed" && order.resultFile) {
          try {
            resultUrl = await getDownloadUrl(order.resultFile);
          } catch {
            // пропускаем
          }
        }

        return {
          id: order.id,
          createdAt: order.createdAt.toISOString(),
          userEmail: order.user?.email || null,
          guestEmail: order.guestEmail || null,
          guestPhone: order.guestPhone || null,
          deliveryMethod: order.deliveryMethod,
          filename: order.originalName,
          status: order.status,
          resultUrl,
          resultName: order.resultName,
          originalUrl,
          isFree: order.isFree,
          rowCount: order.rowCount,
        };
      })
    );

    return NextResponse.json({ orders: ordersWithUrls }, { status: 200 });
  } catch (error) {
    console.error("Admin get orders error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказов" },
      { status: 500 }
    );
  }
}
