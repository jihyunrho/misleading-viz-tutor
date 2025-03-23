import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, User as UserIcon } from "lucide-react";
import LoadingDots from "./LoadingDots";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, useTutorSessionStore } from "@/stores/tutorSessionStore";
import ChatBubble from "./ChatBubble";
import { Skeleton } from "@/components/ui/skeleton";
import InstructionBubble from "./InstructionBubble";

const ChatContainer: React.FC = () => {
  const { currentPage, addMessage } = useTutorSessionStore();
  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = currentPage()?.messages || [];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (input.trim() === "" || isWaitingForResponse) return;

    // Set waiting state to true
    setIsWaitingForResponse(true);

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      type: "user",
      content: input,
    };

    addMessage(userMessage);

    setInput("");

    // Simulate bot response (you would replace with actual API call)
    setTimeout(() => {
      const botMessage: ChatMessage = {
        role: "assistant",
        type: "assistant-reasoning",
        content: "I'm analyzing your question about the visualization...",
      };
      addMessage(botMessage);

      // Set waiting state back to false after response
      setIsWaitingForResponse(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col border-l w-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3">
            {messages.map((message, index) =>
              message.role === "instruction" ? (
                <InstructionBubble key={index} message={message} />
              ) : (
                <ChatBubble key={index} message={message} />
              )
            )}
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
