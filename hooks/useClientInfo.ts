"use client";

import { useEffect } from "react";
import getClientInfo from "@/lib/getClientInfo";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";

export default function useClientInfo() {
  const { ipAddr, userAgent } = useTutorSessionStore();

  const setSession = useTutorSessionStore((state) => state.setSession);

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
