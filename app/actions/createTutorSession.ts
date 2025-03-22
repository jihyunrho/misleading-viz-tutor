"use server";

import { db } from "@/db";
import { tutorSessionsTable } from "@/db/schema";
import { generateRandomTutorSessionId } from "@/lib/utils";

export default async function createTutorSession({
  participantName,
  participantEmail,
}: {
  participantName: string;
  participantEmail: string;
}) {
  try {
    const result = await db
      .insert(tutorSessionsTable)
      .values({
        sessionId: generateRandomTutorSessionId(),
        participantName,
        participantEmail,
      })
      .returning({ sessionId: tutorSessionsTable.sessionId });

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to create tutor session:", error);
    return { success: false, error: "Failed to create tutor session" };
  }
}
