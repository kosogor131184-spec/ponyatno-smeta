"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileSpreadsheet, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      toast.error("Ошибка", { description: "Пароли не совпадают" });
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      toast.error("Ошибка", { description: "Пароль должен содержать минимум 6 символов" });
      return;
    }

    if (!token) {
      setError("Неверная или устаревшая ссылка");
      toast.error("Ошибка", { description: "Неверная или устаревшая ссылка" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка сброса пароля");
        toast.error("Ошибка", { description: data.error || "Попробуйте снова" });
        return;
      }

      toast.success("Пароль изменён", { description: "Теперь вы можете войти" });
      router.push("/auth/signin");
    } catch {
      setError("Произошла ошибка");
      toast.error("Ошибка", { description: "Произошла ошибка при сбросе пароля" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 -left-32 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Понятно <span className="text-amber-500">Смета</span>
            </span>
          </Link>
        </div>

        <Card className="border border-gray-100 shadow-lg rounded-2xl">
          <CardHeader className="pb-2 pt-6 px-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">Новый пароль</h1>
            <p className="text-gray-500 text-sm text-center mt-1">
              Введите и подтвердите новый пароль
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-2">
            {!token ? (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                Ссылка для сброса пароля недействительна или устарела. Запросите новую ссылку.
              </div>
            ) : null}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Новый пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200"
                    required
                    autoComplete="new-password"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Повторите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Сбросить пароль
              </Button>
            </form>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-2">
            <div className="w-full text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться к входу
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
