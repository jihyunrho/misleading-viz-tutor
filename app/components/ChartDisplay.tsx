"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import getInitialIncorrectReasoning from "@/app/actions/getInitialIncorrectReasoning";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import logUserAction from "@/app/actions/logUserAction";

export default function ChartDisplay() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { getSessionData, currentPage, currentPageNumber, updateCurrentPage } =
    useTutorSessionStore();
  const sessionData = getSessionData();
  const page = currentPage();

  // Redirect to home if page object is null
  useEffect(() => {
    if (!page) {
      router.push("/");
    }
  }, [page, router]);

  // Call AI to get incorrect reasoning when component mounts
  useEffect(() => {
    async function getAIReasoning() {
      if (
        page &&
        page.imageFilename &&
        page.misleadingFeature &&
        !page.firstIncorrectReasoning
      ) {
        setLoading(true);
        try {
          const reasoning = await getInitialIncorrectReasoning({
            imageFilename: page.imageFilename,
            imageTitle: page.imageTitle,
            misleadingFeature: page.misleadingFeature,
          });
          updateCurrentPage({ firstIncorrectReasoning: reasoning });

          // No need to await
          logUserAction({
            sessionData,
            pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
            action: `The AI has generated the first incorrect reasoning for the image "${page.imageTitle}". The reasoning is: "${reasoning}".`,
          });
        } catch (error) {
          console.error("Failed to get AI reasoning:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    getAIReasoning();
  }, [page, updateCurrentPage]);

  return page ? (
    <>
      <img
        src={`/api/serve-image?file=${encodeURIComponent(page.imageFilename)}`}
        title={page.imageTitle}
        alt={page.imageTitle}
      />

      <div className="bg-neutral-50 mt-4 px-8 py-6 rounded-xs">
        <h3 className="flex text-neutral-800 justify-between font-bold pb-2 border-b-1">
          <p>AI's First (Incorrect) Reasoning</p>
          {loading && <Spinner size="xs" />}
        </h3>

        {loading ? (
          <>
            <Skeleton className="mt-4 bg-neutral-300 w-3/4 h-6 rounded-sm" />
            <Skeleton className="mt-2 bg-neutral-300 w-3/4 h-6 rounded-sm" />
            <Skeleton className="mt-2 bg-neutral-300 w-3/4 h-6 rounded-sm" />
            <Skeleton className="mt-2 bg-neutral-300 w-1/4 h-6 rounded-sm" />
          </>
        ) : (
          <p className="mt-3 text-base text-neutral-700">
            {page.firstIncorrectReasoning}
          </p>
        )}
      </div>
    </>
  ) : (
    <div>Invalid Page</div>
  );
}
