"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatContainer from "@/app/components/chat/ChatContainer";
import BottomBar from "@/app/components/BottomBar";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import ChartDisplay from "@/app/components/ChartDisplay";
import logUserAction from "@/app/actions/logUserAction";
import useTutorSession from "@/hooks/useTutorSession";

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
    console.log(`page data: ${JSON.stringify(page)}`);

    if (!sessionData.sessionId) return;

    logUserAction({
      sessionData,
      pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
      action: `The participant has navigated to page ${currentPageNumber()}. Image "${
        page.imageTitle
      }" is displayed."`,
    });
  }, [sessionData.sessionId, currentPageIndex]);

  return page ? (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <div className="flex-1 h-full items-center grid grid-cols-2 overflow-hidden">
        <div className="flex h-full flex-col justify-center  px-4 py-2 overflow-y-auto">
          <ChartDisplay />
        </div>

        <div className="flex h-full overflow-hidden">
          <ChatContainer />
        </div>
      </div>

      <BottomBar />
    </div>
  ) : (
    <div>Invalid Page</div>
  );
}
