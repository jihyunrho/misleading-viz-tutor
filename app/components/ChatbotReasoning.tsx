import React from "react";
import { ChatMessageForView } from "@/types";

interface Props {
  message: ChatMessageForView;
  initialIncorrectReasoning: string;
  className?: string;
}

const ChatbotReasoning: React.FC<
  Props & React.HTMLAttributes<HTMLDivElement>
> = ({ message, initialIncorrectReasoning, className = "", ...props }) => {
  const cleanedChatbotReasoning = message.content.trim();
  const cleanedOriginal = initialIncorrectReasoning.trim();

  const isSameAsOriginal =
    cleanedChatbotReasoning === cleanedOriginal ||
    cleanedChatbotReasoning.endsWith(cleanedOriginal); // 혹시 Revised Flawed Reasoning: 붙은 경우 대비

  return (
    <div className={`flex justify-start ${className}`} {...props}>
      <div className="bg-slate-200 text-slate-900 rounded-sm p-3 w-full">
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatbotReasoning;
