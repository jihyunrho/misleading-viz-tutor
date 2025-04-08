"use client";

import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import logUserAction from "@/app/actions/logUserAction";
import useTutorSession from "@/hooks/useTutorSession";

export default function PreSessionPage() {
  const { getSessionData } = useTutorSession();

  const router = useRouter();

  const sessionData = getSessionData();

  // Redirect to home if no session exists
  useEffect(() => {
    if (sessionData.sessionId)
      logUserAction({
        sessionData,
        pageTitle: "Post-session",
        action: `The participant has copmleted the tutoring session.`,
      });
  }, [sessionData.sessionId]);

  return (
    <main className="h-screen max-h-screen flex items-center justify-center bg-neutral-100">
      <div
        className="w-128 p-4 
      rounded flex flex-col"
      >
        <h1 className="text-xl font-semibold">Post-Session Page</h1>

        <Separator className="mt-2" />

        <p className="mt-4">
          This is the post-session page. You should disclose any information to
          a participant here.
        </p>

        <p className="mt-4">
          Please take a screenshot of this page or print it out for your
          records.
        </p>

        <div className="mt-6 p-4 flex flex-col gap-3 border rounded bg-white text-base">
          <h2 className="font-semibold">Session Details</h2>
          <Separator />
          <div className="flex flex-row">
            <div className="w-1/4 font-semibold">Name</div>
            <div className="w-3/4">{sessionData.participantName}</div>
          </div>
          <div className="flex flex-row">
            <div className="w-1/4 font-semibold">Email</div>
            <div className="w-3/4">{sessionData.participantEmail}</div>
          </div>
          <div className="flex flex-row">
            <div className="w-1/4 font-semibold">Session ID</div>
            <div className="w-3/4">{sessionData.sessionId}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
