"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatContainer from "@/app/components/chat/ChatContainer";
import BottomBar from "@/app/components/BottomBar";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import ChartDisplay from "@/app/components/ChartDisplay";
import { Badge } from "@/components/ui/badge";

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
