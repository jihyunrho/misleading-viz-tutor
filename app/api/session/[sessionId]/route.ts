// app/api/session/[sessionId]/route.ts
import { db } from "@/db"; // your Drizzle DB instance
import { tutorSessionsTable, chatMessagesTable } from "@/db/schema";
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

  const { tutor_sessions: session } = result[0];

  console.log("Session data:", session);

  return NextResponse.json({
    ...session,
  });
}
