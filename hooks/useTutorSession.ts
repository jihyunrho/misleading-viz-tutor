import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  _useTutorSessionStore,
  TutorSessionData,
} from "@/stores/tutorSessionStore";
import {
  ChatMessage,
  ChatMessageInput,
  ChatMessageInsertWithMeta,
} from "@/types";

let activeHydratedSessionId: string | null = null;

export function useTutorSession() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const pageNumber = params.pageNumber
    ? parseInt(params.pageNumber as string, 10)
    : null;

  const store = _useTutorSessionStore();
  const currentSessionId = store.sessionId;
  const isAlreadyHydrated = currentSessionId === sessionId;

  const [isLoading, setIsLoading] = useState(!isAlreadyHydrated);

  useEffect(() => {
    if (!sessionId) return;

    if (isAlreadyHydrated || activeHydratedSessionId === sessionId) {
      setIsLoading(false);
      return;
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
        const { session: hydratedSession, messages: hydratedMessages } =
          data as {
            session: Partial<TutorSessionData>;
            messages: ChatMessage[];
          };

        store.setSession({
          sessionId: hydratedSession.sessionId,
          participantName: hydratedSession.participantName,
          participantEmail: hydratedSession.participantEmail,
          startedAt: hydratedSession.startedAt,
          endedAt: hydratedSession.endedAt,
          currentPageIndex: pageNumber ? pageNumber - 1 : 0,
          messages: hydratedMessages,
        });

        activeHydratedSessionId = sessionId;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Hydration error:", err);
        throw err; // Will be caught by nearest error boundary
      });
  }, [sessionId, isAlreadyHydrated]);

  useEffect(() => {
    if (!isAlreadyHydrated) return;
    if (typeof pageNumber === "number") {
      const index = pageNumber - 1;
      if (store.currentPageIndex !== index) {
        store.setSession({ currentPageIndex: index });
      }
    }
  }, [pageNumber, isAlreadyHydrated]);

  const createTemporaryChatMessage = (
    params: ChatMessageInput,
    addToStore: boolean = true
  ) => {
    const { role, type, content } = params;

    const tempMessage: ChatMessageInsertWithMeta = {
      tempId: crypto.randomUUID(),
      sessionId: store.sessionId,
      pageNumber: store.currentPageNumber(),
      imageTitle: store.currentPage()?.imageTitle || "",
      role,
      type,
      content,
    };

    if (addToStore) store.addMessage(tempMessage);

    return tempMessage;
  };

  return {
    sessionData: store.getSessionData(),
    isLoading,
    ...store,
    createTemporaryChatMessage,
  };
}
