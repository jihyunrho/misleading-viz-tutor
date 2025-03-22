"use server";

import { db } from "@/db";
import { userActionLogsTable } from "@/db/schema";
import { TutorSessionData } from "@/stores/tutorSessionStore";

type LogUserActionParams = {
  sessionData: TutorSessionData;
  pageTitle: string;
  action: string;
};

export async function logUserAction(params: LogUserActionParams) {
  try {
    await db.insert(userActionLogsTable).values({
      ipAddr: params.sessionData.ipAddr!,
      userAgent: params.sessionData.userAgent!,
      participantName: params.sessionData.participantName,
      participantEmail: params.sessionData.participantEmail,
      sessionId: params.sessionData.sessionId,
      pageTitle: params.pageTitle,
      action: params.action,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error logging user action:", error);
    throw new Error("Failed to log user action");
  }
}
