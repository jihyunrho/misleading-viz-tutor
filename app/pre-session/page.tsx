"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PreSessionPage() {
  const { session } = useTutorSessionStore();
  const router = useRouter();

  // Redirect to home if no session exists
  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const handleContinue = () => {
    router.push("/tutor-session");
  };

  // Show loading or empty state if session is not available
  if (!session) {
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

        <div className="mt-6 p-4 border rounded bg-white">
          <p>
            <strong>Name:</strong> {session.studentName}
          </p>
          <p>
            <strong>Email:</strong> {session.studentEmail}
          </p>
        </div>
      </div>
    </main>
  );
}
