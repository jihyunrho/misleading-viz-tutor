"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import logUserAction from "@/app/actions/logUserAction";

export default function ChartDisplay() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { getSessionData, currentPage, currentPageNumber } =
    useTutorSessionStore();
  const sessionData = getSessionData();
  const page = currentPage();

  // Redirect to home if page object is null
  useEffect(() => {
    if (!page) {
      router.push("/");
    }
  }, [page, router]);

  return page ? (
    <>
      <div className="p-4">
        <img
          src={`/images/visualizations/${encodeURIComponent(
            page.imageFilename
          )}`}
          title={page.imageTitle}
          alt={page.imageTitle}
        />
      </div>

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
            {page.initialIncorrectReasoning}
          </p>
        )}
      </div>
    </>
  ) : (
    <div>Invalid Page</div>
  );
}
