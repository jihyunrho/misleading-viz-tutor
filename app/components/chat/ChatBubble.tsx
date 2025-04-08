import { ChatMessageForView } from "@/types";
import { cn } from "@/lib/utils";
import { Bot, User as UserIcon } from "lucide-react";

type ChatBubbleProps = {
  message: ChatMessageForView;
};

export default function ChatBubble(props: ChatBubbleProps) {
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
            <Bot className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-neutral-600">
              {props.message.role === "assistant" ? "AI Assistant" : "Me"}
            </span>
          </>
        ) : (
          <>
            <UserIcon className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-medium text-neutral-500">Me</span>
          </>
        )}
      </div>

      <div
        className={cn(
          "rounded-sm p-3",
          props.message.role === "assistant"
            ? "bg-green-50 text-green-600 rounded-tl-none"
            : "bg-blue-50 text-sky-600 rounded-tr-none"
        )}
      >
        {props.message.content}
      </div>
    </div>
  );
}
