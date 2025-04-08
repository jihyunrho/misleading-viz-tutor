"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import logUserAction from "@/app/actions/logUserAction";
import { tutorPagesData } from "@/data/tutor-pages-data";
import useTutorSession from "@/hooks/useTutorSession";

export default function BottomBar() {
  const router = useRouter();

  const {
    getSessionData,
    sessionId,
    participantEmail,
    currentPageNumber,
    currentPage,
    nextPage,
    isLastPage,
  } = useTutorSession();

  const sessionData = getSessionData();
  const page = currentPage()!;

  const handleNextPage = () => {
    if (isLastPage()) {
      // Handle end of session
      router.push(`/tutor-session/${sessionId}/outro`);
    } else {
      logUserAction({
        sessionData,
        pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
        action: `The participant has clicked the next page button on page ${currentPageNumber()}.`,
      });

      nextPage();

      router.push(
        `/tutor-session/${sessionId}/tutor-page/${currentPageNumber()}`
      );
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
          Page {currentPageNumber()} / {tutorPagesData.length}
        </span>
        <div>
          <Progress
            value={
              tutorPagesData.length > 0
                ? (currentPageNumber() / tutorPagesData.length) * 100
                : 0
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
