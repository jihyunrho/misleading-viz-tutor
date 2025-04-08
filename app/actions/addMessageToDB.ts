"use server";

import { db } from "@/db";
import { chatMessagesTable } from "@/db/schema";
import { ChatMessageInsertWithMeta } from "@/types";

export async function addMessageToDB(message: ChatMessageInsertWithMeta) {
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
