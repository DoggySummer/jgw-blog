import { S3Client } from "@aws-sdk/client-s3";

export function getSpacesClient() {
  const endpoint = process.env.SPACES_ENDPOINT;
  const region = process.env.SPACES_REGION ?? "us-east-1";
  const key = process.env.SPACES_KEY;
  const secret = process.env.SPACES_SECRET;

  if (!endpoint || !key || !secret) {
    throw new Error("SPACES_ENDPOINT, SPACES_KEY, SPACES_SECRET 환경 변수가 필요합니다.");
  }

  return new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: key,
      secretAccessKey: secret,
    },
  });
}

export function getSpacesPublicUrl(key: string): string {
  const base = process.env.SPACES_PUBLIC_URL;
  const bucket = process.env.SPACES_BUCKET;
  const endpoint = process.env.SPACES_ENDPOINT;

  if (base) {
    const url = new URL(base);
    url.pathname = "/";
    const origin = url.toString().replace(/\/$/, "");
    return `${origin}/${key}`;
  }
  if (bucket && endpoint) {
    const host = new URL(endpoint).hostname;
    return `https://${bucket}.${host}/${key}`;
  }
  throw new Error("SPACES_PUBLIC_URL 또는 SPACES_BUCKET+SPACES_ENDPOINT가 필요합니다.");
}
