"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatContainer from "@/app/components/chat/ChatContainer";
import BottomBar from "@/app/components/BottomBar";
import ChartAndReasoningDisplay from "@/app/components/ChartAndReasoningDisplay";
import logUserAction from "@/app/actions/logUserAction";
import { useTutorSession } from "@/hooks/useTutorSession";

export default function TutorSessionPage() {
  const router = useRouter();

  const {
    getSessionData,
    isLoading,
    currentPageIndex,
    currentPage,
    currentPageNumber,
  } = useTutorSession();
  const page = currentPage()!;
  const sessionData = getSessionData();

  // Redirect to home if no session exists
  useEffect(() => {
    if (!sessionData.sessionId && !isLoading) {
      router.push("/");
    }
  }, [sessionData.sessionId, router, isLoading]);

  useEffect(() => {
    if (
      !sessionData.sessionId ||
      !sessionData.ipAddr ||
      !sessionData.userAgent! ||
      currentPageIndex < 0
    )
      return;

    logUserAction({
      sessionData,
      pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
      action: `The participant has navigated to page ${currentPageNumber()}. Image "${
        page.imageTitle
      }" is displayed."`,
    });
  }, [
    sessionData.sessionId,
    sessionData.ipAddr,
    sessionData.userAgent,
    currentPageIndex,
  ]);

  return page ? (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <div className="flex-1 h-full grid grid-cols-2 overflow-hidden">
        <div className="flex h-full overflow-hidden">
          <ChartAndReasoningDisplay />
        </div>

        <div className="flex h-full overflow-hidden">
          <ChatContainer />
        </div>
      </div>

      <BottomBar />
    </div>
  ) : (
    <div className="flex flex-col h-screen bg-background items-center justify-center">
      Loading Page
    </div>
  );
}
