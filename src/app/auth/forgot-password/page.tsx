"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка отправки");
        toast.error("Ошибка", { description: data.error || "Попробуйте снова" });
        return;
      }

      setSent(true);
      toast.success("Письмо отправлено", { description: "Проверьте вашу почту" });
    } catch {
      setError("Произошла ошибка");
      toast.error("Ошибка", { description: "Произошла ошибка при отправке" });
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
            <h1 className="text-2xl font-bold text-gray-900 text-center">Восстановление пароля</h1>
            <p className="text-gray-500 text-sm text-center mt-1">
              Введите email, на который зарегистрирован аккаунт
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-2">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Письмо отправлено</h2>
                <p className="text-gray-500 text-sm">
                  Мы отправили ссылку для сброса пароля на <strong className="text-gray-700">{email}</strong>.
                  Проверьте вашу почту и следуйте инструкциям в письме.
                </p>
              </motion.div>
            ) : (
              <>
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

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Отправить ссылку
                  </Button>
                </form>
              </>
            )}
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
