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
  initialIncorrectReasoning: string | null;
};

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
export type ChatMessageInsert = typeof chatMessagesTable.$inferInsert;
export type ChatMessageInsertWithMeta = ChatMessageInsert & {
  tempId: string;
  isSynced: boolean;
};
