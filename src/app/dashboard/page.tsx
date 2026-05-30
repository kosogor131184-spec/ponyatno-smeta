"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Upload,
  Download,
  Trash2,
  Loader2,
  Clock,
  Settings,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Mail,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { UploadModal } from "@/components/UploadModal";

interface Order {
  id: string;
  createdAt: string;
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
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
      fetchOrders();
    }
  }, [status, router, fetchOrders]);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        toast.success("Аккаунт удалён");
        signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        toast.error("Ошибка", { description: data.error || "Не удалось удалить аккаунт" });
      }
    } catch {
      toast.error("Ошибка удаления аккаунта");
    } finally {
      setDeleting(false);
    }
  };

  const handleUploadClick = () => {
    setUploadFile(null);
    setUploadOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!session) return null;

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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              {session.user?.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Личный кабинет</h1>
              <p className="text-gray-500 mt-1">
                Добро пожаловать, <span className="font-medium text-gray-700">{session.user?.email}</span>
              </p>
            </div>
            <Button
              onClick={handleUploadClick}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="w-4 h-4 mr-2" />
              Загрузить смету
            </Button>
          </div>

          {/* Orders Table */}
          <Card className="border border-gray-100 shadow-lg rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <h2 className="text-lg font-semibold text-gray-900">Ваши заказы</h2>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-1">Заказов пока нет</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Загрузите первую смету, чтобы начать работу
                  </p>
                  <Button
                    onClick={handleUploadClick}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Загрузить смету
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Файл</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действие</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const st = statusConfig[order.status];
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="text-gray-600 text-sm">
                              {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900 text-sm max-w-[200px] truncate">
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
                                <span className="text-xs text-gray-400">—</span>
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

          {/* Delete Account */}
          <div className="mt-8 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Удалить аккаунт
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Все ваши данные, включая заказы и файлы,
                    будут безвозвратно удалены.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        file={uploadFile}
        onFileChange={setUploadFile}
      />
    </div>
  );
}
