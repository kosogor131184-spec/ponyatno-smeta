"use client";

import { useState, useEffect, useRef, useCallback, type MouseEvent } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  FileSpreadsheet,
  Eye,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  TrendingUp,
  BarChart3,
  Zap,
  ChevronDown,
  Mail,
  Building2,
  HardHat,
  Briefcase,
  Search,
  FileText,
  Package,
  ListChecks,
  AlertTriangle,
  Sparkles,
  Menu,
  X,
  Upload,
  Settings,
  Cpu,
  Star,
  Users,
  Calculator,
  CreditCard,
  Phone,
  Check,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession, signIn, signOut } from "next-auth/react";
import { UploadModal } from "@/components/UploadModal";

/* ═══════════════════════════════════════════════════════════
   FLOATING SHAPES — decorative background elements
   ═══════════════════════════════════════════════════════════ */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -left-32 w-80 h-80 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }}
      />
      <div
        className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3D TILT CARD — perspective transform on hover (light version)
   ═══════════════════════════════════════════════════════════ */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    card.style.boxShadow = "0 25px 50px -12px rgba(0,0,0,0.15)";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    card.style.boxShadow = "";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION — scroll fade-in helper
   ═══════════════════════════════════════════════════════════ */
function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR — clean, light, sticky
   ═══════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { href: "#how", label: "Как работает" },
    { href: "#result", label: "Результат" },
    { href: "#samples", label: "Образцы" },
    { href: "#pricing", label: "Тарифы" },
    { href: "#faq", label: "Вопросы" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            Понятно{" "}
            <span className="text-amber-500">Смета</span>
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            >
              {l.label}
            </a>
          ))}
          {session ? (
            <div className="flex items-center gap-2 ml-3">
              <Button
                size="sm"
                variant="outline"
                className="text-sm font-medium rounded-full px-4 border-gray-200"
                asChild
              >
                <a href="/dashboard">Личный кабинет</a>
              </Button>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full px-4"
                asChild
              >
                <a href="#cta">Загрузить смету</a>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full px-4"
                asChild
              >
                <a href="/auth/signin">Войти</a>
              </Button>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-full px-5"
                asChild
              >
                <a href="/auth/register">Регистрация</a>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  {l.label}
                </a>
              ))}
              {session ? (
                <>
                  <a
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg"
                  >
                    Личный кабинет
                  </a>
                  <a
                    href="#cta"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Загрузить смету
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Войти
                  </a>
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full"
                    asChild
                  >
                    <a href="/auth/register" onClick={() => setMobileOpen(false)}>
                      Регистрация
                    </a>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO — Dark gradient hero → transitions to light
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const [counters, setCounters] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    const targets = { a: 1284, b: 125, c: 4, d: 100 };
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        a: Math.round(targets.a * ease),
        b: Math.round(targets.b * ease),
        c: Math.round(targets.c * ease),
        d: Math.round(targets.d * ease),
      });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.15) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-amber-500/10 blur-[80px]" />
      <div className="absolute bottom-32 left-[5%] w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 text-sm px-4 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/25 backdrop-blur-sm rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Превращаем хаос в ясность
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
            >
              <span className="text-white">СМЕТЫ НА</span>
              <br />
              <span className="text-white">
                ПОНЯТНОМ ЯЗЫКЕ
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8 leading-relaxed"
            >
              Превращаем стандартные сметы в ясные таблицы. Вы видите{" "}
              <span className="text-amber-400 font-semibold">сколько стоит каждая работа, каждый материал</span>{" "}
              и <span className="text-cyan-400 font-semibold">сколько вы заработаете</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all rounded-full"
                asChild
              >
                <a href="#cta">
                  Попробуй бесплатно (1 смета)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right: Animated card stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
              {/* Back card — смета ДО */}
              <motion.div
                animate={{ rotateY: -8, rotateX: 5, y: -10 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full bg-gradient-to-br from-red-500/20 to-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-2xl p-5 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm font-semibold">Исходная смета</span>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-3 bg-red-500/15 rounded-full" style={{ width: `${90 - i * 12}%` }}></div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-red-400/60 font-mono">1 600+ строк...</div>
              </motion.div>

              {/* Front card — смета ПОСЛЕ */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 mt-16 bg-white/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-semibold">Понятно Смета</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] px-1.5">Работы</Badge>
                    <div className="flex-1 h-3 bg-amber-500/20 rounded-full" />
                    <span className="text-amber-300 text-xs font-mono">751K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px] px-1.5">Материалы</Badge>
                    <div className="flex-1 h-3 bg-cyan-500/20 rounded-full" />
                    <span className="text-cyan-300 text-xs font-mono">342K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-1.5">Прибыль</Badge>
                    <div className="flex-1 h-3 bg-emerald-500/20 rounded-full" />
                    <span className="text-emerald-300 text-xs font-mono">158K</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/50">4 листа • 100% ясность</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 max-w-3xl mx-auto lg:mx-0"
        >
          {[
            { value: counters.a.toLocaleString(), label: "позиций обработано", color: "text-amber-400" },
            { value: `${counters.b}М`, label: "руб. расшифровано", color: "text-cyan-400" },
            { value: `${counters.c}`, label: "листа ясности", color: "text-amber-400" },
            { value: `${counters.d}%`, label: "понимание сметы", color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-3xl sm:text-4xl font-black ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="w-6 h-6 text-amber-400/50" />
      </div>

      {/* Gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFBFC] to-transparent z-[5]" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS — 3 clean cards on light bg
   ═══════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="w-7 h-7" />,
      step: "01",
      title: "Загрузите смету",
      desc: "Присылайте смету в любом формате — Excel, PDF. Мы принимаем стандартные сметы из Гранд-Сметы, Смета.РУ и других программ.",
      iconBg: "bg-amber-100 text-amber-600",
      accent: "bg-amber-500",
    },
    {
      icon: <Settings className="w-7 h-7" />,
      step: "02",
      title: "Анализ и обработка",
      desc: "Наш алгоритм разбирает коды ФЕР/ФССЦ, группирует работы и материалы, приводит единицы измерения, выделяет НР и СП.",
      iconBg: "bg-cyan-100 text-cyan-600",
      accent: "bg-cyan-500",
    },
    {
      icon: <CheckCircle2 className="w-7 h-7" />,
      step: "03",
      title: "Получите результат",
      desc: "Вы получаете файл с 4 листами: описание методики, полная смета, сгруппированные работы и материалы — всё понятно с первого взгляда.",
      iconBg: "bg-emerald-100 text-emerald-600",
      accent: "bg-emerald-500",
    },
  ];

  return (
    <Section id="how" className="py-24 sm:py-32 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Как это работает</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Три шага к пониманию
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Вместо дней разбора — результат за часы
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6 sm:gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300 opacity-30" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <TiltCard>
                <div className="bg-white rounded-2xl p-6 sm:p-8 h-full border border-gray-100 card-shadow-light hover:card-shadow-light-hover transition-shadow duration-300">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.iconBg}`}>
                      {s.icon}
                    </div>
                    <span className="text-6xl font-black text-gray-100">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed">
                    {s.desc}
                  </p>
                  {/* Accent bar */}
                  <div className={`w-12 h-1 rounded-full ${s.accent} mt-5`} />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}



/* ═══════════════════════════════════════════════════════════
   BEFORE/AFTER — Interactive toggle, light bg
   ═══════════════════════════════════════════════════════════ */
function BeforeAfter() {
  const [showAfter, setShowAfter] = useState(false);

  const beforeRows = [
    { code: "ФЕР 07-05-022-05", name: "Установка в бескаркасно-панельных зданиях (с разрезкой на этаж) панелей стеновых наружных площадью: свыше 15 до 25 м2 # прил.7.1.п.3 100 шт Кзп=1.16; Кэм=1.16; Кзм=1.16 Ктз=1.16; Ктзм=1.16 НР 116% от ФОТ СП 80% от ФОТ", cost: "456 527" },
    { code: "ФССЦ 04.1.02.05", name: "Смеси бетонные тяжелого бетона м3", cost: "—" },
    { code: "ФССЦ 05.1.04.08", name: "Панели наружных стен рядовые железобетонные шт", cost: "—" },
    { code: "ФССЦ 04.3.01.09-0014", name: "Раствор готовый кладочный, цементный, М100 м3", cost: "-16 300" },
    { code: "ФССЦ 04.3.01.09-0015", name: "Раствор готовый кладочный, цементный, М150 м3", cost: "17 194" },
    { code: "ФССЦ 04.1.01.01-0181", name: "Смеси бетонные легкого бетона (БСЛ) на пористых заполнителях, средняя плотность D1600 кг/м3, крупность заполнителя более 10 мм, класс В15 (М200) м3", cost: "43 006" },
  ];

  const afterRows = [
    { num: "1", type: "работы", name: "Установка панелей стеновых наружных площадью: свыше 15 до 25 м2", unit: "шт", qty: "68", workCost: "751 348", totalCost: "795 248" },
    { num: "", type: "материалы", name: "Смеси бетонные тяжелого бетона", unit: "м3", qty: "6,53", workCost: "—", totalCost: "—" },
    { num: "", type: "материалы", name: "Панели наружных стен рядовые железобетонные", unit: "шт", qty: "68", workCost: "—", totalCost: "—" },
    { num: "2", type: "материалы", name: "Раствор кладочный, М100", unit: "м3", qty: "-3,43", workCost: "—", totalCost: "-16 300" },
    { num: "3", type: "материалы", name: "Раствор кладочный, М150", unit: "м3", qty: "3,43", workCost: "—", totalCost: "17 194" },
    { num: "4", type: "материалы", name: "Смеси бетонные легкого бетона, D1600, В15", unit: "м3", qty: "6,53", workCost: "—", totalCost: "43 006" },
  ];

  return (
    <Section id="result" className="py-24 sm:py-32 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">До и после</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Почувствуйте разницу
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Одна и та же смета. Но теперь вы понимаете каждую цифру.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !showAfter
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-1.5" />
              ДО — Исходная смета
            </button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showAfter
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
              ПОСЛЕ — Понятно Смета
            </button>
          </div>
        </div>

        {/* Table area */}
        <AnimatePresence mode="wait">
          {!showAfter ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow-light overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold text-sm">
                      Сотни непонятных строк. Как понять, где что и сколько стоит?
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400">
                          <th className="text-left py-2 px-2 font-medium">Шифр</th>
                          <th className="text-left py-2 px-2 font-medium">Наименование</th>
                          <th className="text-right py-2 px-2 font-medium">Стоимость</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beforeRows.map((r, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-red-50/30 transition-colors">
                            <td className="py-2.5 px-2 font-mono text-gray-400 whitespace-nowrap">{r.code}</td>
                            <td className="py-2.5 px-2 text-gray-600 max-w-xs truncate">{r.name}</td>
                            <td className="py-2.5 px-2 text-right font-mono whitespace-nowrap text-gray-700">{r.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm">
                    <strong>Проблема:</strong> Коды ФЕР/ФССЦ, двойные строки в ячейках,
                    коэффициенты Кзп/Кэм/Кзм, отрицательные количества — всё это
                    делает смету нечитаемой.
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow-light overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold text-sm">
                      100% понимания. Каждая позиция ясна, каждая цифра на виду.
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400">
                          <th className="text-left py-2 px-1 font-medium">№</th>
                          <th className="text-left py-2 px-1 font-medium">Тип</th>
                          <th className="text-left py-2 px-1 font-medium">Наименование</th>
                          <th className="text-center py-2 px-1 font-medium">Ед.</th>
                          <th className="text-right py-2 px-1 font-medium">Кол-во</th>
                          <th className="text-right py-2 px-1 font-medium">Работы</th>
                          <th className="text-right py-2 px-1 font-medium">Всего</th>
                        </tr>
                      </thead>
                      <tbody>
                        {afterRows.map((r, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-emerald-50/30 transition-colors">
                            <td className="py-2.5 px-1 font-semibold text-amber-500">{r.num}</td>
                            <td className="py-2.5 px-1">
                              <Badge
                                className={`text-[10px] sm:text-xs px-1.5 py-0 ${
                                  r.type === "работы"
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-cyan-100 text-cyan-700 border-cyan-200"
                                }`}
                              >
                                {r.type}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-1 text-gray-700 max-w-[200px] truncate">{r.name}</td>
                            <td className="py-2.5 px-1 text-center text-gray-400">{r.unit}</td>
                            <td className="py-2.5 px-1 text-right font-mono text-gray-600">{r.qty}</td>
                            <td className="py-2.5 px-1 text-right font-mono text-gray-400">{r.workCost}</td>
                            <td className="py-2.5 px-1 text-right font-mono font-medium text-gray-700">{r.totalCost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs sm:text-sm">
                    <strong>Результат:</strong> Работы и материалы разделены. Понятные
                    названия. Чёткие итоги. Видно стоимость каждой позиции и общую
                    сумму по разделу.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SAMPLE SHEETS — 3D tilt cards with real screenshots
   ═══════════════════════════════════════════════════════════ */
function SampleSheets() {
  return (
    <Section id="samples" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Образцы листов</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Как выглядят результаты
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Два ключевых листа из четырёх — работы и материалы
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Sample 1: Лист Работы */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TiltCard>
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow-light overflow-hidden group">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-900">Лист Работы</span>
                </div>
                <div className="p-3 overflow-hidden">
                  <img
                    src="/sample-raboty.png"
                    alt="Образец листа Работы"
                    className="w-full rounded-lg border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300 group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Sample 2: Лист Материалы */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TiltCard>
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow-light overflow-hidden group">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-900">Лист Материалы</span>
                </div>
                <div className="p-3 overflow-hidden">
                  <img
                    src="/sample-materialy.png"
                    alt="Образец листа Материалы"
                    className="w-full rounded-lg border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300 group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHAT YOU GET (4 SHEETS) — clean cards on light bg
   ═══════════════════════════════════════════════════════════ */
function WhatYouGet() {
  const sheets = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Описание",
      desc: "Методика обработки, общие цифры сметы, стоимость работ и материалов, накладные расходы (НР) и сметная прибыль (СП), предупреждения об аномалиях.",
      iconBg: "bg-amber-100 text-amber-600",
      accent: "from-amber-400 to-amber-500",
    },
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "Смета",
      desc: "Полная детализация всех позиций с разделением на работы и материалы. Итоги по разделам. Каждая строка с номером, типом и стоимостью.",
      iconBg: "bg-cyan-100 text-cyan-600",
      accent: "from-cyan-400 to-cyan-500",
    },
    {
      icon: <HardHat className="w-6 h-6" />,
      title: "Работы",
      desc: "Сгруппированные по видам работ: армирование, кладка, окраска, изоляция и т.д. С подытогами, объёмами и средней стоимостью за единицу.",
      iconBg: "bg-amber-100 text-amber-600",
      accent: "from-amber-400 to-amber-500",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Материалы",
      desc: "Сгруппированные по типам: алюминиевые конструкции, оконные блоки, растворы и т.д. С приведением единиц измерения к сопоставимому виду.",
      iconBg: "bg-cyan-100 text-cyan-600",
      accent: "from-cyan-400 to-cyan-500",
    },
  ];

  return (
    <Section className="py-24 sm:py-32 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Что вы получаете</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            4 листа полной ясности
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Каждый лист решает конкретную задачу предпринимателя
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {sheets.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full border border-gray-100 card-shadow-light hover:card-shadow-light-hover transition-shadow duration-300 group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{s.title}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
                {/* Bottom accent line */}
                <div className={`mt-5 h-1 w-16 rounded-full bg-gradient-to-r ${s.accent} opacity-60 group-hover:opacity-100 group-hover:w-24 transition-all duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHO NEEDS THIS — Target audience cards
   ═══════════════════════════════════════════════════════════ */
function WhoNeedsThis() {
  const audiences = [
    {
      icon: <Briefcase className="w-7 h-7" />,
      title: "Предприниматели и руководители",
      desc: "Те, кто устал разбираться в сотнях строк смет и хочет с первого взгляда понимать — сколько стоит каждая работа, каждый материал и сколько они заработают.",
      iconBg: "bg-amber-100 text-amber-600",
      accent: "from-amber-400 to-amber-500",
    },
    {
      icon: <HardHat className="w-7 h-7" />,
      title: "Строительные компании и подрядчики",
      desc: "Те, кто регулярно работает со сметами из Гранд-Сметы и Смета.РУ и хочет быстро видеть суть — без ручного разбора кодов ФЕР/ФССЦ и коэффициентов.",
      iconBg: "bg-cyan-100 text-cyan-600",
      accent: "from-cyan-400 to-cyan-500",
    },
    {
      icon: <Search className="w-7 h-7" />,
      title: "Тендерные специалисты",
      desc: "Те, кто анализирует сметы конкурентов и заказчиков и нуждается в быстрой оценке стоимости работ и материалов для принятия решений.",
      iconBg: "bg-emerald-100 text-emerald-600",
      accent: "from-emerald-400 to-emerald-500",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Инвесторы и заказчики",
      desc: "Те, кто вкладывает деньги в строительство и хочет прозрачной картины — где каждый рубль, какие работы запланированы и нет ли скрытых затрат.",
      iconBg: "bg-violet-100 text-violet-600",
      accent: "from-violet-400 to-violet-500",
    },
  ];

  return (
    <Section id="audience" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Целевая аудитория</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Кому это нужно
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Всем, кто работает со строительными сметами и ценит своё время
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard>
                <div className="bg-white rounded-2xl p-6 sm:p-8 h-full border border-gray-100 card-shadow-light hover:card-shadow-light-hover transition-shadow duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${a.iconBg} mb-5 group-hover:scale-110 transition-transform`}>
                    {a.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{a.title}</h3>
                  <p className="text-gray-500 leading-relaxed">
                    {a.desc}
                  </p>
                  {/* Bottom accent line */}
                  <div className={`mt-5 h-1 w-12 rounded-full bg-gradient-to-r ${a.accent} opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-300`} />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRICING — 3 tiers with new prices
   ═══════════════════════════════════════════════════════════ */
function Pricing() {
  const plans = [
    {
      name: "Разовая обработка",
      price: "3 000",
      unit: "руб",
      desc: "200 обработанных строк",
      details: "Это может быть 1 или 10 смет — вы платите за объём строк!",
      features: [
        "200 строк обработки",
        "4 листа результата",
        "Работы и материалы отдельно",
        "Выделение НР и СП",
        "Предупреждения об аномалиях",
      ],
      iconBg: "bg-amber-100 text-amber-600",
      icon: <Calculator className="w-6 h-6" />,
      btnText: "Загрузить смету",
      btnClass: "bg-amber-500 hover:bg-amber-600 text-white",
      popular: false,
      border: "border-gray-100",
    },
    {
      name: "Подписка",
      price: "6 000",
      unit: "руб/мес",
      desc: "600 обработанных строк",
      details: "Для регулярной работы со сметами. Экономия при большом объёме!",
      features: [
        "600 строк в месяц",
        "4 листа результата",
        "Работы и материалы отдельно",
        "Выделение НР и СП",
        "Предупреждения об аномалиях",
        "Приоритетная обработка",
      ],
      iconBg: "bg-cyan-100 text-cyan-600",
      icon: <Crown className="w-6 h-6" />,
      btnText: "Оформить подписку",
      btnClass: "bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600 text-white",
      popular: true,
      border: "border-amber-200",
    },
    {
      name: "Для компаний",
      price: "Обсудить",
      unit: "",
      desc: "Индивидуальные условия",
      details: "Для компаний и тех, кто хочет свои условия обработки смет.",
      features: [
        "Объём по договорённости",
        "4 листа результата",
        "Работы и материалы отдельно",
        "Интеграция по API",
        "Персональный менеджер",
        "SLA и приоритет",
      ],
      iconBg: "bg-gray-100 text-gray-600",
      icon: <Building2 className="w-6 h-6" />,
      btnText: "Обсудить",
      btnClass: "bg-gray-900 hover:bg-gray-800 text-white",
      popular: false,
      border: "border-gray-100",
    },
  ];

  return (
    <Section id="pricing" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Тарифы</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Простые и прозрачные цены
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Платите за объём, а не за количество смет
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-amber-500 to-cyan-500 text-white border-0 px-4 py-1 text-xs font-semibold shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}
              <TiltCard>
                <div className={`bg-white rounded-2xl p-6 sm:p-8 h-full border-2 ${plan.border} card-shadow-light hover:card-shadow-light-hover transition-all duration-300 ${plan.popular ? "ring-2 ring-amber-400/20" : ""}`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center mb-5`}>
                    {plan.icon}
                  </div>

                  {/* Plan name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    {plan.unit && <span className="text-gray-400 ml-1 text-sm">{plan.unit}</span>}
                  </div>

                  {/* Description */}
                  <p className="text-amber-600 font-semibold text-sm mb-1">{plan.desc}</p>
                  <p className="text-gray-400 text-sm mb-6">{plan.details}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className={`w-full py-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${plan.btnClass}`}
                    asChild
                  >
                    <a href="#cta">{plan.btnText}</a>
                  </Button>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ — accordion on light bg
   ═══════════════════════════════════════════════════════════ */
function FAQ() {
  const items = [
    {
      q: "Какие форматы смет вы принимаете?",
      a: "Мы работаем со сметами из Гранд-Смета, Смета.РУ и других программ в форматах Excel (.xlsx, .xls) и PDF. Если ваш формат не указан — напишите нам, и мы разберёмся.",
    },
    {
      q: "Сколько времени занимает обработка?",
      a: "Обычно результат готов в течение нескольких часов после загрузки сметы. Для подписчиков доступна приоритетная обработка. Сложные сметы с нестандартными кодами могут потребовать дополнительного времени.",
    },
    {
      q: "Что такое «строка обработки»?",
      a: "Строка обработки — это одна позиция в смете (код ФЕР/ФССЦ с наименованием и объёмом). Цена зависит от общего количества строк, а не от числа смет. Одна смета на 200 строк или 10 смет по 20 строк — одна и та же цена.",
    },
    {
      q: "Мои данные в безопасности?",
      a: "Да, абсолютная конфиденциальность. Мы не передаём ваши сметы третьим лицам. Данные обрабатываются в защищённой среде и удаляются после выдачи результата.",
    },
    {
      q: "Что если результат не устроит?",
      a: "Мы гарантируем качество. Если в обработке обнаружатся ошибки — бесплатно исправим. Наша цель — чтобы вы на 100% понимали каждую цифру в смете.",
    },
    {
      q: "Можно ли подключить обработку по API?",
      a: "Да, для корпоративных клиентов мы предлагаем интеграцию по API. Это позволяет автоматически отправлять сметы на обработку и получать результаты. Обсудите условия с нами.",
    },
  ];

  return (
    <Section id="faq" className="py-24 sm:py-32 bg-[#FAFBFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">Вопросы</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Часто задаваемые вопросы
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-white rounded-xl border border-gray-100 card-shadow-light px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-gray-900 font-semibold hover:no-underline py-5 text-[15px]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-500 leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA — Upload section with gradient bg
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadModalOpen(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <Section id="cta" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 30% 50%, rgba(245,158,11,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.2) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Начните сейчас</div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
          Загрузите смету
        </h2>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-4">
          Присылайте смету — получите ясный результат с полным пониманием каждой цифры
        </p>
        {session && (
          <p className="text-amber-300 text-sm mb-6">
            Вы вошли как {session.user?.email}. Первая смета — бесплатно!
          </p>
        )}

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-2xl p-8 sm:p-12 hover:border-amber-400/40 transition-colors cursor-pointer"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <motion.div
            animate={dragOver ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragOver ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-gray-400"}`}>
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-white font-semibold mb-1">
              Перетащите файл сюда или нажмите
            </p>
            <p className="text-gray-400 text-sm mb-2">
              Excel (.xlsx, .xls) или PDF
            </p>
            {selectedFile && (
              <p className="text-amber-400 text-sm font-medium">
                Выбран: {selectedFile.name}
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.pdf"
              onChange={handleInputChange}
            />
          </motion.div>
        </motion.div>

        {/* Or contact */}
        <div className="mt-8 flex flex-col items-center gap-4 text-gray-400 text-sm">
          <span>Или свяжитесь с нами:</span>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a href="mailto:kosogor_mv@mail.ru" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Mail className="w-4 h-4" />
              kosogor_mv@mail.ru
            </a>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Cpu className="w-4 h-4" />
              Разработчик сервиса: +7-913-896-33-15
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Building2 className="w-4 h-4" />
              Отдел продаж и развития: +7-913-716-18-87
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <UploadModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          file={selectedFile}
          onFileChange={setSelectedFile}
        />
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER — dark elegant
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#0F172A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Понятно <span className="text-amber-400">Смета</span>
            </span>
          </a>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition-colors">Как работает</a>
            <a href="#pricing" className="hover:text-white transition-colors">Тарифы</a>
            <a href="#faq" className="hover:text-white transition-colors">Вопросы</a>
            <a href="#cta" className="hover:text-amber-400 transition-colors font-semibold">Попробовать бесплатно</a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-gray-500">
            <a href="mailto:kosogor_mv@mail.ru" className="hover:text-gray-300 transition-colors">kosogor_mv@mail.ru</a>
            <span>Разработчик: +7-913-896-33-15</span>
            <span>Отдел продаж: +7-913-716-18-87</span>
            <a href="/privacy" className="hover:text-gray-300 transition-colors">Политика конфиденциальности</a>
            <span>&copy; {new Date().getFullYear()} Понятно Смета</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />

      <BeforeAfter />
      <SampleSheets />
      <WhatYouGet />
      <WhoNeedsThis />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
