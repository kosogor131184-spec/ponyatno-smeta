-- ═══════════════════════════════════════════
-- Таблицы для Понятно Смета
-- Выполнить в Supabase SQL Editor
-- ═══════════════════════════════════════════

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'user',
  "freeUsed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Уникальный индекс по email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Таблица заказов
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "guestEmail" TEXT,
  "guestPhone" TEXT,
  "deliveryMethod" TEXT,
  "originalFile" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "resultFile" TEXT,
  "resultName" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "rowCount" INTEGER,
  "isFree" BOOLEAN NOT NULL DEFAULT false,
  "consentGiven" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Внешний ключ
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Индекс для быстрого поиска заказов пользователя
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");

-- Создать администратора (email: admin@ponyatno-smeta.ru, пароль: admin123)
-- Пароль будет захеширован при первом запуске через скрипт
INSERT INTO "User" ("id", "email", "name", "passwordHash", "role")
VALUES (
  'admin_001',
  'kosogor_mv@mail.ru',
  'Администратор',
  '$2a$10$PlaceholderHashWillBeUpdated',
  'admin'
) ON CONFLICT ("email") DO NOTHING;
