"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Upload,
  Download,
  Loader2,
  Clock,
  Settings,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";

interface Order {
  id: string;
  createdAt: string;
  userEmail: string | null;
  guestEmail: string | null;
  filename: string;
  status: "pending" | "processing" | "completed";
  resultUrl?: string;
}

const statusConfig = {
  pending: {
    label: "Ожидает",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3" />,
  },
  processing: {
    label: "В обработке",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: <Settings className="w-3 h-3" />,
  },
  completed: {
    label: "Готово",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      toast.error("Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      if ((session?.user as { role?: string })?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      fetchOrders();
    }
  }, [status, session, router, fetchOrders]);

  const handleUploadResult = async (orderId: string, file: File) => {
    setUploadingId(orderId);
    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("file", file);

      const res = await fetch("/api/admin/orders/result", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Результат загружен", { description: "Заказ отмечен как выполненный" });
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error("Ошибка", { description: data.error || "Не удалось загрузить результат" });
      }
    } catch {
      toast.error("Ошибка загрузки");
    } finally {
      setUploadingId(null);
    }
  };

  const handleFileSelect = (orderId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.pdf,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUploadResult(orderId, file);
      }
    };
    input.click();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!session || (session?.user as { role?: string })?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Понятно <span className="text-amber-500">Смета</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-700 border-red-200 gap-1">
              <Shield className="w-3 h-3" />
              Админ
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Панель администратора</h1>
            <p className="text-gray-500 mt-1">Управление заказами и загрузка результатов</p>
          </div>

          {/* Orders Table */}
          <Card className="border border-gray-100 shadow-lg rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Все заказы</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOrders}
                  className="rounded-xl"
                >
                  Обновить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-1">Заказов пока нет</h3>
                  <p className="text-gray-500 text-sm">
                    Когда появятся заказы, они будут отображаться здесь
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Файл</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Результат</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const st = statusConfig[order.status];
                        const email = order.userEmail || order.guestEmail || "—";
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs text-gray-400">
                              {order.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 max-w-[180px] truncate">
                              {email}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900 text-sm max-w-[180px] truncate">
                              {order.filename}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${st.color} text-xs gap-1 font-medium`}
                              >
                                {st.icon}
                                {st.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {order.status === "completed" && order.resultUrl ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  asChild
                                >
                                  <a href={order.resultUrl} download>
                                    <Download className="w-4 h-4 mr-1" />
                                    Скачать
                                  </a>
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl text-amber-600 border-amber-200 hover:bg-amber-50"
                                  disabled={uploadingId === order.id}
                                  onClick={() => handleFileSelect(order.id)}
                                >
                                  {uploadingId === order.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <Upload className="w-4 h-4 mr-1" />
                                  )}
                                  Загрузить
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" />
    </div>
  );
}
