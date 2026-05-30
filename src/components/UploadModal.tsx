"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function UploadModal({ open, onOpenChange, file, onFileChange }: UploadModalProps) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "whatsapp" | "telegram">("email");
  const [contactValue, setContactValue] = useState("");
  const [consent, setConsent] = useState(false);
  const [loggedInConsent, setLoggedInConsent] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChange(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmitGuest = async () => {
    if (!file) { toast.error("Выберите файл сметы"); return; }
    if (!contactValue) { toast.error("Укажите контакт для отправки результата"); return; }
    if (!consent) { toast.error("Необходимо согласие на обработку персональных данных"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("deliveryMethod", deliveryMethod);
      if (deliveryMethod === "email") {
        formData.append("guestEmail", contactValue);
      } else {
        formData.append("guestPhone", contactValue);
      }
      formData.append("consentGiven", "true");

      const res = await fetch("/api/orders/upload", { method: "POST", body: formData });
      if (res.ok) {
        toast.success("Смета отправлена!", { description: "Результат будет отправлен на указанный контакт" });
        onFileChange(null);
        setContactValue("");
        setConsent(false);
        onOpenChange(false);
      } else {
        const data = await res.json();
        toast.error("Ошибка", { description: data.error || "Не удалось отправить смету" });
      }
    } catch {
      toast.error("Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLoggedIn = async () => {
    if (!file) { toast.error("Выберите файл сметы"); return; }
    if (!loggedInConsent) { toast.error("Необходимо согласие на обработку персональных данных"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("deliveryMethod", "cabinet");
      formData.append("consentGiven", "true");

      const res = await fetch("/api/orders/upload", { method: "POST", body: formData });
      if (res.ok) {
        toast.success("Смета отправлена!", { description: "Результат будет доступен в личном кабинете" });
        onFileChange(null);
        setLoggedInConsent(false);
        onOpenChange(false);
      } else {
        const data = await res.json();
        toast.error("Ошибка", { description: data.error || "Не удалось отправить смету" });
      }
    } catch {
      toast.error("Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Как получить результат?
          </DialogTitle>
        </DialogHeader>

        {isLoggedIn ? (
          /* ═══ LOGGED IN MODE ═══ */
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              Вы вошли как <strong>{session?.user?.email}</strong>. Результат будет доступен в личном кабинете.
              {!session?.user?.email?.includes("admin") && " Первая смета — бесплатно!"}
            </div>

            {/* File zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-amber-300 hover:bg-amber-50/30 transition-colors cursor-pointer"
            >
              <input type="file" accept=".xlsx,.xls,.pdf,.csv" onChange={handleFileChange} className="hidden" id="file-upload-logged" />
              <label htmlFor="file-upload-logged" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-amber-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} КБ</p>
                    </div>
                    <button type="button" onClick={(e) => { e.preventDefault(); onFileChange(null); }} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Перетащите файл или <span className="text-amber-600 font-medium">выберите файл</span></p>
                    <p className="text-xs text-gray-400 mt-1">Excel, PDF, CSV</p>
                  </>
                )}
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox id="logged-consent" checked={loggedInConsent} onCheckedChange={(c) => setLoggedInConsent(c === true)} className="mt-0.5" />
              <Label htmlFor="logged-consent" className="text-sm text-gray-600 font-normal leading-snug cursor-pointer">
                Я согласен на <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">обработку персональных данных</Link>
              </Label>
            </div>

            <Button onClick={handleSubmitLoggedIn} disabled={loading || !file} className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Отправить смету
            </Button>
          </div>
        ) : (
          /* ═══ GUEST MODE — Two tabs ═══ */
          <Tabs defaultValue="with-registration" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-xl h-auto p-1">
              <TabsTrigger value="with-registration" className="rounded-lg py-2.5 text-xs sm:text-sm">С регистрацией</TabsTrigger>
              <TabsTrigger value="without-registration" className="rounded-lg py-2.5 text-xs sm:text-sm">Без регистрации</TabsTrigger>
            </TabsList>

            <TabsContent value="with-registration" className="mt-4">
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Зарегистрируйтесь</h3>
                  <p className="text-sm text-gray-500">Все ваши заказы будут в личном кабинете. Вы сможете отслеживать статус и скачивать результаты в любое время. Первая смета — бесплатно!</p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg w-full" asChild>
                  <Link href="/auth/register">Зарегистрироваться <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <p className="text-sm text-gray-500">Уже есть аккаунт? <Link href="/auth/signin" className="text-amber-600 hover:text-amber-700 font-medium">Войти</Link></p>
              </div>
            </TabsContent>

            <TabsContent value="without-registration" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Способ получения результата</Label>
                  <RadioGroup value={deliveryMethod} onValueChange={(v) => { setDeliveryMethod(v as "email" | "whatsapp" | "telegram"); setContactValue(""); }} className="grid grid-cols-3 gap-2">
                    <div>
                      <RadioGroupItem value="email" id="r-email" className="peer sr-only" />
                      <Label htmlFor="r-email" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 cursor-pointer transition-all peer-data-[state=checked]:border-amber-400 peer-data-[state=checked]:bg-amber-50 hover:border-gray-300">
                        <Mail className="w-5 h-5" />
                        <span className="text-xs font-medium">Email</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="whatsapp" id="r-whatsapp" className="peer sr-only" />
                      <Label htmlFor="r-whatsapp" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 cursor-pointer transition-all peer-data-[state=checked]:border-amber-400 peer-data-[state=checked]:bg-amber-50 hover:border-gray-300">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-medium">WhatsApp</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="telegram" id="r-telegram" className="peer sr-only" />
                      <Label htmlFor="r-telegram" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 cursor-pointer transition-all peer-data-[state=checked]:border-amber-400 peer-data-[state=checked]:bg-amber-50 hover:border-gray-300">
                        <Send className="w-5 h-5" />
                        <span className="text-xs font-medium">Telegram</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">{deliveryMethod === "email" ? "Email" : "Номер телефона"}</Label>
                  <Input id="contact" type={deliveryMethod === "email" ? "email" : "tel"} placeholder={deliveryMethod === "email" ? "email@example.com" : "+7 (___) ___-__-__"} value={contactValue} onChange={(e) => setContactValue(e.target.value)} className="h-11 rounded-xl border-gray-200" required />
                </div>

                <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-amber-300 hover:bg-amber-50/30 transition-colors cursor-pointer">
                  <input type="file" accept=".xlsx,.xls,.pdf,.csv" onChange={handleFileChange} className="hidden" id="file-upload-guest" />
                  <label htmlFor="file-upload-guest" className="cursor-pointer">
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileSpreadsheet className="w-6 h-6 text-amber-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} КБ</p>
                        </div>
                        <button type="button" onClick={(e) => { e.preventDefault(); onFileChange(null); }} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Перетащите файл или <span className="text-amber-600 font-medium">выберите</span></p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Excel, PDF, CSV</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="guest-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" />
                  <Label htmlFor="guest-consent" className="text-sm text-gray-600 font-normal leading-snug cursor-pointer">
                    Я согласен на <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">обработку персональных данных</Link>
                  </Label>
                </div>

                <Button onClick={handleSubmitGuest} disabled={loading || !file || !contactValue || !consent} className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Отправить смету
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
