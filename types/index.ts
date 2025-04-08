import { chatMessagesTable } from "@/db/schema";

export type VisualizationImage = {
  imageTitle: string;
  imageFilename: string;
  misleadingFeature: string;
  initialIncorrectReasoning: string;
};

export type TutorPage = {
  instruction: string;
  imageTitle: string;
  imageFilename: string;
  misleadingFeature: string;
  initialIncorrectReasoning: string;
};

export type ChatMessageInput = {
  role: string;
  type: string;
  content: string;
};

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
export type ChatMessageInsert = typeof chatMessagesTable.$inferInsert;
export type ChatMessageInsertWithMeta = ChatMessageInsert & {
  tempId: string;
};

export type ChatMessageForView = ChatMessage | ChatMessageInsertWithMeta;
