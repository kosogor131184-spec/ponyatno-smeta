"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, ArrowLeft, Shield, Mail, Clock, Database, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Понятно <span className="text-amber-500">Смета</span>
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Политика конфиденциальности
          </h1>
          <p className="text-gray-500 mb-8">
            Последнее обновление: 1 марта 2025 г.
          </p>

          <div className="space-y-6">
            {/* Section 1 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      1. Что такое персональные данные
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Персональные данные — любая информация, относящаяся прямо или косвенно
                      к определённому или определяемому физическому лицу (субъекту персональных
                      данных). В контексте сервиса «Понятно Смета» к персональным данным
                      относятся данные, которые вы предоставляете при регистрации, оформлении
                      заказа или направлении запроса.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      2. Какие данные мы собираем
                    </h2>
                    <ul className="text-gray-600 leading-relaxed space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Email</strong> — адрес электронной почты, указанный при регистрации или оформлении заказа</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Телефон</strong> — номер телефона, указанный при заказе без регистрации (если выбран способ доставки через WhatsApp или Telegram)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Файлы смет</strong> — загруженные вами файлы строительных смет в форматах Excel, PDF и других поддерживаемых форматах</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Пароль</strong> — хранится в зашифрованном виде (хеш) и не доступен нам в открытом виде</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      3. Зачем мы обрабатываем ваши данные
                    </h2>
                    <ul className="text-gray-600 leading-relaxed space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Обработка заказов</strong> — приём, обработка и подготовка результатов по загруженным сметам</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Отправка результатов</strong> — доставка обработанных смет на указанный email, через WhatsApp или Telegram</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Идентификация</strong> — обеспечение доступа к личному кабинету и истории заказов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span><strong>Связь</strong> — уведомления о статусе заказа и ответы на ваши обращения</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      4. Как мы храним данные
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Ваши данные хранятся на защищённом сервере с использованием базы данных
                      PostgreSQL (Supabase, регион eu-west-3, Париж). Загруженные файлы смет
                      хранятся в защищённом облачном хранилище S3 (Reg.ru, Россия). Передача данных
                      третьим лицам не осуществляется, за исключением случаев, предусмотренных
                      законодательством РФ. Мы принимаем организационные и технические меры для
                      защиты ваших данных от несанкционированного доступа, изменения, раскрытия
                      или уничтожения. Пароли хранятся в виде хешей и не доступны нам в открытом виде.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      5. Срок хранения данных
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Персональные данные и файлы смет хранятся в течение <strong>30 дней</strong> после
                      завершения обработки заказа. По истечении этого срока все данные, включая
                      загруженные файлы и результаты обработки, безвозвратно удаляются. Данные
                      аккаунта (email, пароль) хранятся до момента удаления аккаунта пользователем
                      или до поступления запроса на удаление.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      6. Право на удаление данных
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Вы имеете право запросить удаление своих персональных данных в любой момент.
                      Это можно сделать двумя способами:
                    </p>
                    <ul className="text-gray-600 leading-relaxed space-y-2 mt-3">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">1.</span>
                        <span><strong>Через личный кабинет</strong> — нажмите кнопку «Удалить аккаунт» в настройках профиля. Все ваши данные будут удалены безвозвратно.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">2.</span>
                        <span><strong>По запросу</strong> — отправьте письмо на адрес <a href="mailto:kosogor_mv@mail.ru" className="text-amber-600 hover:text-amber-700 underline">kosogor_mv@mail.ru</a> с темой «Удаление персональных данных». Запрос будет обработан в течение 3 рабочих дней.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      7. Ответственный за обработку данных
                    </h2>
                    <div className="text-gray-600 leading-relaxed space-y-2">
                      <p>
                        Оператором персональных данных является:
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="font-semibold text-gray-900">Косогор Михаил Васильевич</p>
                        <p className="mt-1">
                          Email:{" "}
                          <a href="mailto:kosogor_mv@mail.ru" className="text-amber-600 hover:text-amber-700 underline">
                            kosogor_mv@mail.ru
                          </a>
                        </p>
                      </div>
                      <p className="mt-3">
                        По всем вопросам, связанным с обработкой персональных данных,
                        вы можете обратиться по указанному адресу электронной почты.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      8. Правовые основания
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Обработка персональных данных осуществляется в соответствии с{" "}
                      <a
                        href="https://base.garant.ru/101542300/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 underline"
                      >
                        Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»
                      </a>
                      . Обработка данных производится на основании согласия субъекта персональных
                      данных, выраженного при регистрации или оформлении заказа, а также в случаях,
                      предусмотренных законодательством Российской Федерации.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Понятно Смета. Все права защищены.
          </div>
        </motion.div>
      </main>
    </div>
  );
}
