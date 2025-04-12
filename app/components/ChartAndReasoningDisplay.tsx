"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useTutorSession } from "@/hooks/useTutorSession";
import ChatbotReasoning from "@/app/components/ChatbotReasoning";
import { cn } from "@/lib/utils";
import { ChatMessageForView } from "@/types";

export default function ChartAndReasoningDisplay() {
  const router = useRouter();

  const {
    currentPage,
    currentMessages,
    createTemporaryChatMessage,
    isWaitingForChatbotResponse,
  } = useTutorSession();
  const page = currentPage();
  const chatbotMessages: ChatMessageForView[] = [
    createTemporaryChatMessage(
      {
        role: "chatbot",
        type: "chatbot-reasoing",
        content: page?.initialIncorrectReasoning!,
      },
      false
    ),
    ...currentMessages().filter((m) => m.role === "chatbot"),
  ];

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatbotMessages]);

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

      <div className="shadow-md">
        <h3 className="flex text-neutral-800 justify-between text-sm font-bold py-2 px-4 border-b-1">
          <p>
            {chatbotMessages.length === 0
              ? "🤖 AI VizBluff's Incorrect Initial Reasoning"
              : "🤖 AI VizBluff's Initial and Revised Reasoning"}
          </p>
          {isWaitingForChatbotResponse && <Spinner size="xs" />}
        </h3>
      </div>

      <div className="flex-[1] overflow-auto">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3 p-4">
            {chatbotMessages.map((message, index) => {
              return (
                <ChatbotReasoning
                  key={index}
                  message={message}
                  initialIncorrectReasoning={page.initialIncorrectReasoning!}
                  className={cn(
                    index + 1 < chatbotMessages.length
                      ? "opacity-40"
                      : "font-semibold"
                  )}
                />
              );
            })}

            {isWaitingForChatbotResponse && (
              <Skeleton className="bg-slate-100 w-full h-8 rounded-sm" />
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
