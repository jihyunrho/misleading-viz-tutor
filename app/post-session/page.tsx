"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PostSessionPage() {
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
          a participant after responding to the questions.
        </p>

        <p className="mt-4">
          You will be redirected to the tutor session page after clicking the
          button below.
        </p>
      </div>
    </main>
  );
}
