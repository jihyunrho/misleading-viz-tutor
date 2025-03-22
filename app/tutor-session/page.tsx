"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatBox from "@/app/components/chat/ChatBox";
import BottomBar from "@/app/components/BottomBar";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import ChartDisplay from "@/app/components/ChartDisplay";

export default function TutorSessionPage() {
  const router = useRouter();

  const { sessionId, currentPage } = useTutorSessionStore();
  const page = currentPage();

  // Redirect to home if no session exists
  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);

  return page ? (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <div className="bg-amber-600 text-center p-2">
        <h2>Instructions</h2>
        {page.instruction}
      </div>
      <div className="flex-1 h-full items-center grid grid-cols-2 overflow-hidden">
        <div className="flex flex-col px-4 py-2 overflow-auto">
          <ChartDisplay />
        </div>

        <div className="flex h-full overflow-hidden">
          <ChatBox />
        </div>
      </div>

      <BottomBar />
    </div>
  ) : (
    <div>Invalid Page</div>
  );
}
