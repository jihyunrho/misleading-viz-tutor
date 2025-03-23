"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import logUserAction from "@/app/actions/logUserAction";

export default function BottomBar() {
  const router = useRouter();

  const {
    getSessionData,
    sessionId,
    participantEmail,
    currentPageIndex,
    currentPageNumber,
    currentPage,
    pages,
    nextPage,
    isLastPage,
  } = useTutorSessionStore();

  const sessionData = getSessionData();
  const page = currentPage()!;

  const handleNextPage = () => {
    if (isLastPage()) {
      // Handle end of session
      router.push("/post-session");
    } else {
      logUserAction({
        sessionData,
        pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
        action: `The participant has clicked the next page button on page ${currentPageNumber()}.`,
      });

      nextPage();
    }
  };

  return (
    <footer className="bg-neutral-800 text-neutral-300 text-center py-2 px-4 flex items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-neutral-700 text-neutral-300 rounded-xs">
            Email
          </Badge>
          <span className="text-sm text-neutral-400">{participantEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-neutral-700 text-neutral-300 rounded-xs">
            Session ID
          </Badge>
          <span className="text-sm text-neutral-400">{sessionId}</span>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span className="text-xs">
          Page {currentPageNumber()} / {pages.length}
        </span>
        <div>
          <Progress
            value={
              pages.length > 0 ? (currentPageNumber() / pages.length) * 100 : 0
            }
            className="w-32 h-2 [&>*]:bg-green-500 bg-neutral-600"
          />
        </div>
      </div>

      <Button
        variant="secondary"
        className="flex items-center gap-2 rounded-xs cursor-pointer"
        onClick={handleNextPage}
      >
        {isLastPage() ? (
          <>
            Finish <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            Next Page <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </footer>
  );
}
