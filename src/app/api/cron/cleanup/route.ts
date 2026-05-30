import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deleteOrderFiles } from "@/lib/s3";

// Этот эндпоинт вызывается по расписанию (cron) для удаления файлов старше 30 дней
// На Vercel можно использовать Vercel Cron Jobs (бесплатно на Hobby)
// Для защиты используем секретный заголовок

export async function GET(request: Request) {
  try {
    // Проверяем авторизацию cron (по заголовку)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "cron-secret"}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const retentionDays = Number(process.env.FILE_RETENTION_DAYS) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Находим заказы старше retentionDays с файлами, которые ещё не удалены
    const oldOrders = await db.order.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        deletedAt: null,
      },
    });

    console.log(`Found ${oldOrders.length} orders older than ${retentionDays} days`);

    let deletedCount = 0;

    for (const order of oldOrders) {
      try {
        // Удаляем файлы из S3
        await deleteOrderFiles(order.originalFile, order.resultFile);

        // Помечаем заказ как удалённый (не удаляем саму запись для истории)
        await db.order.update({
          where: { id: order.id },
          data: {
            deletedAt: new Date(),
            originalFile: "",
            resultFile: null,
          },
        });

        deletedCount++;
      } catch (error) {
        console.error(`Failed to cleanup order ${order.id}:`, error);
      }
    }

    return NextResponse.json({
      message: `Очистка завершена`,
      checked: oldOrders.length,
      deleted: deletedCount,
      retentionDays,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Ошибка при очистке файлов" },
      { status: 500 }
    );
  }
}
