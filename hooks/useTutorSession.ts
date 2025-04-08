import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";

let activeHydratedSessionId: string | null = null;

export default function useTutorSession() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const pageNumber = params.pageNumber
    ? parseInt(params.pageNumber as string, 10)
    : null;

  const store = useTutorSessionStore();
  const currentSessionId = store.sessionId;
  const isAlreadyHydrated = currentSessionId === sessionId;

  const [isLoading, setIsLoading] = useState(!isAlreadyHydrated);

  console.log(
    "useTutorSession: sessionId =",
    sessionId,
    "isAlreadyHydrated =",
    isAlreadyHydrated,
    "currentSessionId =",
    currentSessionId
  );

  useEffect(() => {
    if (!sessionId) return;

    if (isAlreadyHydrated || activeHydratedSessionId === sessionId) {
      setIsLoading(false);
      return;
    }

    if (activeHydratedSessionId && activeHydratedSessionId !== sessionId) {
      store.resetSession();
    }

    setIsLoading(true);

    fetch(`/api/session/${sessionId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Session not found");
        }
        return res.json();
      })
      .then((data) => {
        store.setSession({
          sessionId: data.sessionId,
          participantName: data.participantName,
          participantEmail: data.participantEmail,
          startTime: data.startedAt,
          endTime: data.endedAt,
          currentPageIndex: pageNumber ? pageNumber - 1 : 0,
          ipAddr: null,
          userAgent: null,
        });

        activeHydratedSessionId = sessionId;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hydration error:", err);
        throw err; // Will be caught by nearest error boundary
      });
  }, [sessionId, isAlreadyHydrated]);

  return {
    sessionData: store.getSessionData(),
    isLoading,
    ...store,
  };
}
