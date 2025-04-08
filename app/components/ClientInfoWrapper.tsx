"use client";

import useClientInfo from "@/hooks/useClientInfo";

export default function ClientInfoWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useClientInfo();
  return <>{children}</>;
}
