"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logUserAction } from "@/app/actions/logUserAction";

export default function PreSessionPage() {
  const { getSessionData } = useTutorSessionStore();
  const router = useRouter();

  const sessionData = getSessionData();

  // Redirect to home if no session exists
  useEffect(() => {
    if (!sessionData.sessionId) {
      router.push("/");
    }
  }, [sessionData.sessionId, router]);

  const handleContinue = async () => {
    await logUserAction({
      sessionData,
      pageTitle: "Pre-session",
      action: `The participant clicked the continue button on the pre-session page.`,
    });

    router.push("/tutor-session");
  };

  // Show loading or empty state if session is not available
  if (!sessionData.sessionId) {
    return (
      <main className="h-screen max-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">Redirecting...</div>
      </main>
    );
  }

  return (
    <main className="h-screen max-h-screen flex items-center justify-center bg-neutral-100">
      <div
        className="w-128 p-4 
      rounded flex flex-col"
      >
        <h1 className="text-xl font-semibold">Pre-Session Page</h1>

        <Separator className="mt-2" />

        <p className="mt-4">
          This is the pre-session page. You should disclose any necessary
          information to a participant here.
        </p>

        <p className="mt-4">
          You will be redirected to the tutor session page after clicking the
          button below.
        </p>

        <Button
          onClick={handleContinue}
          className="mt-4 p-6 text-base cursor-pointer"
        >
          <Check className="mr-2" />I understand and wish to continue
        </Button>

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
