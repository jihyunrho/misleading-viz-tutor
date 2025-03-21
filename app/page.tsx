"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import ChatBox from "./components/ChatBox";

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const [userEmail, setUserEmail] = useState("user@example.com"); // This would typically come from authentication

  // Generate a random 6-digit alphanumeric session ID
  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setSessionId(result);
  }, []);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <div className="bg-amber-600 text-center p-2">
        <h2>Hello World</h2>
        The instructions will go here.
      </div>
      <div className="flex-1 h-full items-center grid grid-cols-2 overflow-hidden">
        <div className="flex flex-col px-4 py-2 overflow-auto">
          <img src="/images/visualizations/bar1_2.png" alt="Chart 1" />
          <p className="mt-4 text-center text-sm text-muted-foreground"></p>
          <p>
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

      {/* Session info in bottom-left corner */}
      <div className="absolute left-4 bottom-4 rounded-md bg-muted p-3 text-sm">
        <div>
          <strong>Email:</strong> {userEmail}
        </div>
        <div>
          <strong>Session ID:</strong> {sessionId}
        </div>
      </div>

      <div className="bg-amber-600 text-center p-2">Bottom Bar</div>
    </div>
  );
}
