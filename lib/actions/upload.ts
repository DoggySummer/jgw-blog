"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { getSpacesClient, getSpacesPublicUrl } from "@/lib/spaces";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function getExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return map[mime] ?? "bin";
}

export async function uploadImage(formData: FormData): Promise<
  | { url: string }
  | { error: string }
> {
  const session = await auth();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { error: "파일을 선택해 주세요." };
  }

  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return { error: "허용된 형식: JPEG, PNG, GIF, WebP" };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "파일 크기는 5MB 이하여야 합니다." };
  }

  const bucket = process.env.SPACES_BUCKET;
  if (!bucket) {
    return { error: "SPACES_BUCKET 환경 변수가 설정되지 않았습니다." };
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const ext = getExt(file.type);
  const key = `uploads/${y}/${m}/${crypto.randomUUID()}.${ext}`;

  try {
    const client = getSpacesClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      })
    );

    const url = getSpacesPublicUrl(key);
    return { url };
  } catch (e) {
    console.error("Spaces upload error:", e);
    return { error: "업로드에 실패했습니다." };
  }
}
