import { ChatMessageForView } from "@/types";
import { cn } from "@/lib/utils";
import { Bot, User as UserIcon } from "lucide-react";

type ChatbotReasoningBox = {
  message: ChatMessageForView;
};

export default function ChatBubble(props: ChatbotReasoningBox) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[90%]",
        props.message.type === "user"
          ? "items-end ml-auto mr-4"
          : "items-start ml-4"
      )}
    >
      <div className="flex items-center gap-1 mb-1">
        {props.message.role === "assistant" ? (
          <>
            🧠
            <span className="text-xs font-medium text-neutral-600">
              {props.message.role === "assistant" ? "AI Assistant" : "Me"}
            </span>
          </>
        ) : (
          <>
            <UserIcon className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-neutral-500">Me</span>
          </>
        )}
      </div>

      <div
        className={cn(
          "rounded-md p-3 text-sm",
          props.message.role === "assistant"
            ? "bg-neutral-100  text-neutral-800 rounded-tl-none"
            : "bg-blue-50 text-blue-700 rounded-tr-none"
        )}
      >
        {props.message.content}
      </div>
    </div>
  );
}
