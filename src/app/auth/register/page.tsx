"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileSpreadsheet, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);
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

    if (!consent) {
      setError("Необходимо согласие на обработку персональных данных");
      toast.error("Ошибка", { description: "Необходимо согласие на обработку персональных данных" });
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      toast.error("Ошибка", { description: "Пароль должен содержать минимум 6 символов" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        toast.error("Ошибка регистрации", { description: data.error || "Попробуйте снова" });
        return;
      }

      toast.success("Регистрация успешна!", { description: "Теперь вы можете войти" });
      router.push("/auth/signin?registered=1");
    } catch {
      setError("Произошла ошибка при регистрации");
      toast.error("Ошибка", { description: "Произошла ошибка при регистрации" });
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
            <h1 className="text-2xl font-bold text-gray-900 text-center">Регистрация</h1>
            <p className="text-gray-500 text-sm text-center mt-1">
              Создайте аккаунт для доступа к личному кабинету
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-2">
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
                <Label htmlFor="password">Пароль</Label>
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
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="text-sm text-gray-600 font-normal leading-snug cursor-pointer">
                  Я согласен на{" "}
                  <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
                    обработку персональных данных
                  </Link>
                </Label>
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
                Зарегистрироваться
              </Button>
            </form>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-2">
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">
                Уже есть аккаунт?{" "}
                <Link
                  href="/auth/signin"
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Войти
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
