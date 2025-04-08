"use client";

import { useEffect } from "react";
import getClientInfo from "@/lib/getClientInfo";
import { useTutorSession } from "@/hooks/useTutorSession";

export default function useClientInfo() {
  const { ipAddr, userAgent, setSession } = useTutorSession();

  useEffect(() => {
    if (!ipAddr || !userAgent) {
      getClientInfo().then((clientInfo) => {
        setSession({
          ipAddr: clientInfo.ipAddr,
          userAgent: clientInfo.userAgent,
        });
      });
    }
  }, [ipAddr, userAgent, setSession]);
}
