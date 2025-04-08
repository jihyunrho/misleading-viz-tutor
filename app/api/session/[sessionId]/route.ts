// app/api/session/[sessionId]/route.ts
import { db } from "@/db"; // your Drizzle DB instance
import { tutorSessionsTable, chatMessagesTable } from "@/db/schema";
import { TutorSessionData } from "@/stores/tutorSessionStore";
import { ChatMessage } from "@/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const result = await db
    .select()
    .from(tutorSessionsTable)
    .leftJoin(
      chatMessagesTable,
      eq(tutorSessionsTable.sessionId, chatMessagesTable.sessionId)
    )
    .where(eq(tutorSessionsTable.sessionId, sessionId));

  if (result.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Extract session from the first result
  const session: Partial<TutorSessionData> = result[0].tutor_sessions;

  // Transform messages to ensure it's always an array
  const messages: ChatMessage[] = result
    .map((row) => row.chat_messages)
    .filter((message): message is ChatMessage => message !== null);

  return NextResponse.json({
    session,
    messages,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  // Parse the request body
  const body = await req.json();

  // Filter out invalid fields
  const { participantName, participantEmail, startedAt, endedAt } = body;
  const updates: Record<string, any> = {};

  if (participantName) updates.participantName = participantName;
  if (participantEmail) updates.participantEmail = participantEmail;
  if (startedAt) updates.startedAt = new Date(startedAt);
  if (endedAt) updates.endedAt = new Date(endedAt);

  // Ensure there is at least one field to update
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided for update" },
      { status: 400 }
    );
  }

  // Perform the update
  const result = await db
    .update(tutorSessionsTable)
    .set(updates)
    .where(eq(tutorSessionsTable.sessionId, sessionId))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Session updated successfully",
    session: result[0],
  });
}
