// app/components/chat/FeedbackBubble.tsx
import React from "react";
import { ChatMessageForView } from "@/types";

interface Props {
  message: ChatMessageForView;
}

const FeedbackBubble: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex justify-start px-4">
      <div className="bg-blue-100 text-blue-900 rounded-2xl px-4 py-3 max-w-md shadow-sm">
        <p className="text-xs font-semibold mb-1 text-blue-700">
          🧠 AI Assistant (Feedback)
        </p>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default FeedbackBubble;
