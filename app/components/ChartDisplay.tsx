"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Redirect to home if page object is null
  useEffect(() => {
    if (!page) {
      router.push("/");
    }
  }, [page, router]);

  return page ? (
    <div className="flex h-full flex-col border-l w-full">
      <div className="flex-[1] overflow-auto border-b flex justify-center">
        <img
          src={`/images/visualizations/${encodeURIComponent(
            page.imageFilename
          )}`}
          title={page.imageTitle}
          alt={page.imageTitle}
          className="max-h-full w-auto object-contain p-2"
        />
      </div>

      <div>
        <h3 className="flex text-neutral-800 justify-between font-bold py-2 px-4 border-b-1">
          <p>AI's First (Incorrect) Reasoning</p>
          {loading && <Spinner size="xs" />}
        </h3>
      </div>

      <div className="flex-[1] overflow-auto">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3">
            {loading ? (
              <>
                <Skeleton className="mt-4 bg-neutral-300 w-3/4 h-6 rounded-sm" />
                <Skeleton className="mt-2 bg-neutral-300 w-3/4 h-6 rounded-sm" />
                <Skeleton className="mt-2 bg-neutral-300 w-3/4 h-6 rounded-sm" />
                <Skeleton className="mt-2 bg-neutral-300 w-1/4 h-6 rounded-sm" />
              </>
            ) : (
              <p className="p-4 text-base text-neutral-700">
                {page.initialIncorrectReasoning}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  ) : (
    <div>Invalid Page</div>
  );
}
