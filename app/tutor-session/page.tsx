"use client";

import { useEffect, useState } from "react";

import ChatBox from "../components/chat/ChatBox";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TutorSessionPage() {
  const [sessionId, setSessionId] = useState("a1b2c3");
  const [userEmail, setUserEmail] = useState("user@example.com"); // This would typically come from authentication

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <div className="bg-amber-600 text-center p-2">
        <h2>Hello World</h2>
        The instructions will go here.
      </div>
      <div className="flex-1 h-full items-center grid grid-cols-2 overflow-hidden">
        <div className="flex flex-col px-4 py-2 overflow-auto">
          <img src="/images/visualizations/bar1_2.png" alt="Chart 1" />

          <p className="font-bold mt-4 py-2 border-b-1">
            AI's First (Incorrect) Reasoning
          </p>

          <p className="mt-2">
            Wow, the number of bicycles sold has skyrocketed dramatically from
            2017 to 2021! It looks like the sales have increased by a huge
            percentage each year. This must mean that biking is becoming
            incredibly popular, and the demand has exploded almost overnight!
          </p>
        </div>

        <div className="flex h-full overflow-hidden">
          <ChatBox />
        </div>
      </div>

      <div className="bg-neutral-900 text-neutral-300 text-center py-2 px-4 flex items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-neutral-700 text-neutral-300 rounded-xs">
              Email
            </Badge>
            <span className="text-sm text-neutral-400">{userEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-neutral-700 text-neutral-300 rounded-xs">
              Session ID
            </Badge>
            <span className="text-sm text-neutral-400">{sessionId}</span>
          </div>
        </div>
        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-xs cursor-pointer"
        >
          Next Graph <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
