// app/api/session/[sessionId]/route.ts
import { db } from "@/db"; // your Drizzle DB instance
import { tutorSessionsTable, chatMessagesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ChatMessage, TutorSessionData } from "@/stores/tutorSessionStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const [session] = await db
    .select()
    .from(tutorSessionsTable)
    .where(eq(tutorSessionsTable.sessionId, sessionId));

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId));

  const pages = groupMessagesIntoPages(messages); // helper below

  return NextResponse.json({
    ...session,
    pages,
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
      imagePath: msg.imagePath,
      pageInstruction: msg.pageInstruction,
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

// Helper to reshape chatMessages into TutorPage[]
function groupMessagesIntoPages(messages: any[]): TutorSessionData["pages"] {
  const grouped = new Map<number, ChatMessage[]>();

  messages.forEach((msg) => {
    if (!grouped.has(msg.pageNumber)) grouped.set(msg.pageNumber, []);
    grouped.get(msg.pageNumber)?.push({
      role: msg.role,
      type: msg.type,
      content: msg.content,
      createdAt: msg.createdAt,
    });
  });

  return [];
}
