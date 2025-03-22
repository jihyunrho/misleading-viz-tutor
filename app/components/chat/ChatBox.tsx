import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, User as UserIcon } from "lucide-react";
import LoadingDots from "./LoadingDots";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/stores/tutorSessionStore";

interface ChatBoxProps {
  // Define your props here
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your visualization tutor. What questions do you have about this chart?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response (you would replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm analyzing your question about the visualization...",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Set waiting state back to false after response
      setIsWaitingForResponse(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col border-l">
      <div className="px-4 py-2">
        <Badge className="rounded-xs">
          <MessageSquare />
          Chat
        </Badge>
      </div>

      <div className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4 pt-2" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[90%]",
                  message.sender === "user"
                    ? "items-end ml-auto"
                    : "items-start"
                )}
              >
                <div className="flex items-center gap-1 mb-1">
                  {message.sender === "bot" ? (
                    <Bot className="h-4 w-4 text-green-600" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-xs font-medium text-neutral-600">
                    {message.sender === "bot" ? "AI Assistant" : "Me"}
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-sm p-3",
                    message.sender === "user"
                      ? "bg-neutral-50 text-neutral-600 rounded-tr-none"
                      : "bg-green-50 text-green-600 rounded-tl-none"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
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

export default ChatBox;
