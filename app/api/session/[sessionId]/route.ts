// app/api/session/[sessionId]/route.ts
import { db } from "@/db"; // your Drizzle DB instance
import { tutorSessionsTable, chatMessagesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { TutorSessionData } from "@/stores/tutorSessionStore";

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

  const { tutor_sessions: session } = result[0];

  return NextResponse.json({
    ...session,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const body = await req.json();

  // Update session progress
  if (body.currentPageIndex !== undefined) {
    await db
      .update(tutorSessionsTable)
      .set({ currentPageNumber: body.currentPageIndex })
      .where(eq(tutorSessionsTable.sessionId, sessionId));
  }

  // Insert chat messages (if any new ones)
  if (Array.isArray(body.newMessages)) {
    const newRows = body.newMessages.map((msg: any) => ({
      sessionId,
      pageNumber: msg.pageNumber,
      imageTitle: msg.imageTitle,
      role: msg.role,
      type: msg.type,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    if (newRows.length > 0) {
      await db.insert(chatMessagesTable).values(newRows);
    }
  }

  return NextResponse.json({ success: true });
}
