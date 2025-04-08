"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pyramid, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingDots from "@/app/components/chat/LoadingDots";
import ChatBubble from "@/app/components/chat/ChatBubble";
import { Skeleton } from "@/components/ui/skeleton";
import getEvaluationAndUpdatedReasoning from "@/app/actions/getEvaluationAndUpdatedReasoning";
import logUserAction from "@/app/actions/logUserAction";
import { Badge } from "@/components/ui/badge";
import { useTutorSession } from "@/hooks/useTutorSession";
import { addMessageToDB } from "@/app/actions/addMessageToDB";

const ChatContainer: React.FC = () => {
  const {
    setSession,
    getSessionData,
    currentPageNumber,
    currentPage,
    createTemporaryChatMessage,
    replaceMessage,
    currentMessages,
    isWaitingForChatbotResponse,
  } = useTutorSession();
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionData = getSessionData();
  const page = currentPage()!;

  const messages = currentMessages();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isWaitingForChatbotResponse) return;

    // Set waiting state to true
    setSession({ isWaitingForChatbotResponse: true });

    const tempUserMessage = createTemporaryChatMessage({
      role: "user",
      type: "user",
      content: input,
    });

    // Insert user message into DB and log the action concurrently
    const userMessagePromise = addMessageToDB(tempUserMessage).then(
      ({ success, data }) => {
        if (success && data) {
          replaceMessage(tempUserMessage.tempId, data);
        }
      }
    );

    const logUserActionPromise = logUserAction({
      sessionData,
      pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
      action: `The participant has typed a message: "${input}".`,
    });

    // Wait for both promises to complete
    await Promise.all([userMessagePromise, logUserActionPromise]);

    // Fetch evaluation and reasoning
    const { assistantFeedback, chatbotReasoning } =
      await getEvaluationAndUpdatedReasoning({
        imageTitle: page.imageTitle,
        imageFilename: page.imageFilename,
        misleadingFeature: page.misleadingFeature,
        initialIncorrectReasoning: page.initialIncorrectReasoning,
        userCorrection: input,
      });

    // Create temporary assistant and chatbot messages
    const tempAssistantFeedback = createTemporaryChatMessage({
      role: "assistant",
      type: "assistant-feedback",
      content: assistantFeedback,
    });

    const tempChatbotReasoning = createTemporaryChatMessage({
      role: "chatbot",
      type: "chatbot-reasoning",
      content: chatbotReasoning,
    });

    // Insert assistant and chatbot messages into DB concurrently
    const assistantFeedbackPromise = addMessageToDB(tempAssistantFeedback).then(
      ({ success, data }) => {
        if (success && data) {
          replaceMessage(tempAssistantFeedback.tempId, data);
        }
      }
    );

    const chatbotReasoningPromise = addMessageToDB(tempChatbotReasoning).then(
      ({ success, data }) => {
        if (success && data) {
          replaceMessage(tempChatbotReasoning.tempId, data);
        }
      }
    );

    // Log the bot's response concurrently
    const logBotActionPromise = logUserAction({
      sessionData,
      pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
      action: `The bot responded with assistant + chatbot messages. Reasoning: "${chatbotReasoning}", Feedback: "${assistantFeedback}".`,
    });

    // Wait for all promises to complete
    await Promise.all([
      assistantFeedbackPromise,
      chatbotReasoningPromise,
      logBotActionPromise,
    ]);

    // Clear input and reset waiting state
    setInput("");
    setSession({ isWaitingForChatbotResponse: false });
  };

  return (
    <div className="flex h-full flex-col border-l w-full">
      <div className="flex items-center">
        <div className="bg-neutral-900 text-white text-sm py-3 px-4 shadow">
          <Badge className="bg-neutral-100 text-neutral-800 font-semibold rounded-xs">
            <Pyramid />
            Instruction
          </Badge>
          <p className="mt-2 font-semibold">
            With the help of AI Assistant, fix the AI's reasoning of the visual.
            When you are satisfied with the AI's revised reasoning, click on the
            "Next" button.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3 py-4">
            {messages
              .filter((m) => m.role === "assistant" || m.role === "user")
              .map((message, index) => {
                return <ChatBubble key={index} message={message} />;
              })}
            {isWaitingForChatbotResponse && (
              <div className="ml-4 flex flex-col gap-3">
                <Skeleton className="w-1/4 h-4 bg-neutral-200 rounded-sm" />
                <Skeleton className="w-3/4 h-6 bg-neutral-200  rounded-sm" />
              </div>
            )}
            {/* This empty div serves as our scroll target */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="flex items-center border-t p-4">
        <div className="flex w-full items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-10 flex-1 rounded-xs resize-none"
            disabled={isWaitingForChatbotResponse}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !isWaitingForChatbotResponse
              ) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 rounded-xs cursor-pointer"
            disabled={isWaitingForChatbotResponse || input.trim() === ""}
          >
            {isWaitingForChatbotResponse ? (
              <LoadingDots />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
