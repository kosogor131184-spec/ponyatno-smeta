"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileSpreadsheet, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
        toast.error("Ошибка входа", { description: "Неверный email или пароль" });
      } else {
        toast.success("Вход выполнен", { description: "Перенаправление..." });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Произошла ошибка при входе");
      toast.error("Ошибка", { description: "Произошла ошибка при входе" });
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
            <h1 className="text-2xl font-bold text-gray-900 text-center">Вход в аккаунт</h1>
            <p className="text-gray-500 text-sm text-center mt-1">
              Введите email и пароль для входа
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-2">
            {registered && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                Регистрация прошла успешно! Теперь вы можете войти.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Войти
              </Button>
            </form>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-2">
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">
                Нет аккаунта?{" "}
                <Link
                  href="/auth/register"
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
