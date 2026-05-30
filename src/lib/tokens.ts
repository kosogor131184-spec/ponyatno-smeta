import crypto from "crypto";
import { db } from "./db";

/** Create a password reset token for the given email. Returns the token string. */
export async function createToken(email: string): Promise<string> {
  // Удаляем старые токены для этого email
  await db.passwordResetToken.deleteMany({
    where: { email },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 час

  await db.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt,
    },
  });

  return token;
}

/** Validate a reset token. Returns the associated email if valid, null otherwise. */
export async function validateToken(token: string): Promise<string | null> {
  const found = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!found) return null;

  // Проверяем срок действия
  if (found.expiresAt < new Date()) {
    // Токен истёк — удаляем
    await db.passwordResetToken.delete({ where: { token } });
    return null;
  }

  return found.email;
}

/** Delete a token after it has been used. */
export async function deleteToken(token: string): Promise<void> {
  try {
    await db.passwordResetToken.delete({ where: { token } });
  } catch {
    // Токен уже удалён — игнорируем
  }
}
