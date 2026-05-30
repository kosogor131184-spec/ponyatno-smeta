import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Создаём S3 клиент
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "ru-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true, // Важно для Reg.ru/Sweb S3
});

const BUCKET = process.env.S3_BUCKET || "2105";

// Папки в бакете
const FOLDERS = {
  originals: "uploads/originals",
  results: "uploads/results",
} as const;

/**
 * Загрузить файл в S3 (оригинал сметы)
 */
export async function uploadOriginal(
  file: File,
  orderId: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "xlsx";
  const key = `${FOLDERS.originals}/${orderId}/${file.name}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return key;
}

/**
 * Загрузить файл результата в S3
 */
export async function uploadResult(
  file: File,
  orderId: string
): Promise<string> {
  const key = `${FOLDERS.results}/${orderId}/${file.name}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType:
        file.type ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );

  return key;
}

/**
 * Получить подписанную URL для скачивания файла (действительна 1 час)
 */
export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/**
 * Удалить файл из S3
 */
export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

/**
 * Удалить все файлы заказа (оригинал + результат)
 */
export async function deleteOrderFiles(
  originalKey: string,
  resultKey?: string | null
): Promise<void> {
  await deleteFile(originalKey);
  if (resultKey) {
    await deleteFile(resultKey);
  }
}
