import React from "react";
import { ChatMessage } from "@/stores/tutorSessionStore";

interface Props {
  message: ChatMessage;
  firstIncorrectReasoning: string;
}

const ChatbotBubble: React.FC<Props> = ({ message, firstIncorrectReasoning }) => {
  const cleanedChatbotReasoning = message.content.trim();
  const cleanedOriginal = firstIncorrectReasoning.trim();

  const isSameAsOriginal =
    cleanedChatbotReasoning === cleanedOriginal ||
    cleanedChatbotReasoning.endsWith(cleanedOriginal); // 혹시 Revised Flawed Reasoning: 붙은 경우 대비

  return (
    <div className="flex justify-start px-4">
      <div className="bg-green-100 text-green-900 rounded-2xl px-4 py-3 max-w-md shadow-sm">
        <p className="text-xs font-semibold mb-1 text-green-700">🤖 AI Chatbot (Revised Reasoning)</p>
        <p className="text-sm whitespace-pre-wrap">
          {isSameAsOriginal ? "No revised reasoning." : message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatbotBubble;
