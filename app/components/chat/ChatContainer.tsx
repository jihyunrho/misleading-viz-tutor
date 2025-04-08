import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pyramid, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingDots from "./LoadingDots";
import { ChatMessage, useTutorSessionStore } from "@/stores/tutorSessionStore";
import ChatBubble from "./ChatBubble";
import FeedbackBubble from "./FeedbackBubble";
import ChatbotBubble from "./ChatbotBubble";
import { Skeleton } from "@/components/ui/skeleton";
import InstructionBubble from "./InstructionBubble";
import getEvaluationAndUpdatedReasoning from "@/app/actions/getEvaluationAndUpdatedReasoning";
import logUserAction from "@/app/actions/logUserAction";
import { Badge } from "@/components/ui/badge";

const ChatContainer: React.FC = () => {
  const { getSessionData, currentPageNumber, currentPage, addMessage } =
    useTutorSessionStore();
  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionData = getSessionData();
  const page = currentPage()!;
  const {
    imageTitle,
    imageFilename,
    misleadingFeature,
    initialIncorrectReasoning,
  } = page;

  const messages = sessionData.messages;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isWaitingForResponse) return;

    // Set waiting state to true
    setIsWaitingForResponse(true);

    addMessage({
      role: "user",
      type: "user",
      content: input,
    });

    await logUserAction({
      sessionData,
      pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
      action: `The participant has typed a message: "${input}".`,
    });

    const { assistantFeedback, chatbotReasoning } =
      await getEvaluationAndUpdatedReasoning({
        imageTitle,
        imageFilename,
        misleadingFeature,
        firstIncorrectReasoning: initialIncorrectReasoning!,
        userCorrection: input,
      });

    addMessage({
      role: "assistant",
      type: "assistant-feedback",
      content: assistantFeedback,
    });
    addMessage({
      role: "chatbot",
      type: "chatbot-reasoning",
      content: chatbotReasoning,
    });

    await logUserAction({
      sessionData,
      pageTitle: `Page ${currentPageNumber()} - ${page.imageTitle}`,
      action: `The bot responded with assistant + chatbot messages.`,
    });

    setInput("");

    // Set waiting state back to false after response
    setIsWaitingForResponse(false);
  };

  return (
    <div className="flex h-full flex-col border-l w-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3">
            <div className="bg-neutral-100 font-semibold p-4">
              <Badge className="bg-white text-neutral-700 rounded-xs">
                <Pyramid />
                Instruction
              </Badge>
              <p className="mt-2 text-neutral-700">
                With the help of AI Assistant, fix the Stupid AI's reasoning of
                the image. When you are satisfied with the AI's revised
                reasoning, click on the "Next" button.
              </p>
            </div>
            {messages.map((message, index) => {
              switch (message.role) {
                case "instruction":
                  return <InstructionBubble key={index} message={message} />;
                case "assistant":
                  return <FeedbackBubble key={index} message={message} />; // 🔧
                case "chatbot":
                  return (
                    <ChatbotBubble
                      key={index}
                      message={message}
                      initialIncorrectReasoning={
                        page.initialIncorrectReasoning!
                      }
                    />
                  ); // 🔧
                default:
                  return <ChatBubble key={index} message={message} />;
              }
            })}
            {isWaitingForResponse && (
              <div className="ml-4 flex flex-col gap-3">
                <Skeleton className="w-1/4 h-4 bg-green-100 rounded-sm" />
                <Skeleton className="w-3/4 h-6 bg-green-100  rounded-sm" />
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
            disabled={isWaitingForResponse}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isWaitingForResponse) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 rounded-xs cursor-pointer"
            disabled={isWaitingForResponse || input.trim() === ""}
          >
            {isWaitingForResponse ? (
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
