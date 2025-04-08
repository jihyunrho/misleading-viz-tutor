"use server";

import OpenAI from "openai";
import { db } from "@/db";
import { threadIdsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type FunctionParams = {
  sessionId: string;
  imageFilename: string;
};

export async function getOrCreateThreadId({
  sessionId,
  imageFilename,
}: FunctionParams) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not found");

    const openai = new OpenAI({ apiKey });

    // Step 1: Look for existing thread
    const [existing] = await db
      .select()
      .from(threadIdsTable)
      .where(
        and(
          eq(threadIdsTable.sessionId, sessionId),
          eq(threadIdsTable.imageFilename, imageFilename)
        )
      );

    if (existing) {
      return existing.threadId;
    }

    // Step 2: Create new thread if not found
    const newThread = await openai.beta.threads.create();

    // Step 3: Insert into DB
    await db.insert(threadIdsTable).values({
      threadId: newThread.id,
      sessionId,
      imageFilename,
    });

    return newThread.id;
  } catch (error) {
    console.error("getOrCreateThreadId error:", error);
    throw new Error("Unable to get or create thread ID");
  }
}
