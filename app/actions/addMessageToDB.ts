"use server";

import { db } from "@/db";
import { chatMessagesTable } from "@/db/schema";
import { ChatMessageInsert } from "@/types";

type AddMessageParams = {
  message: ChatMessageInsert;
};

export async function addMessageToDB({ message }: AddMessageParams) {
  try {
    const result = await db
      .insert(chatMessagesTable)
      .values(message)
      .returning();

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to insert message:", error);
    return { success: false, error: "Failed to insert message" };
  }
}
