"use server";

export async function getBaseUrl(): Promise<string> {
  const isVercel = !!process.env.VERCEL_URL;

  const baseUrl = isVercel
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return baseUrl;
}
