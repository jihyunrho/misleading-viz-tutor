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
    <div className="flex flex-col h-screen bg-background">
      <div className="grid h-screen grid-cols-2 gap-4 items-center">
        <div className="flex flex-col px-4 py-2">
          <img src="/images/visualizations/bar1_2.png" alt="Chart 1" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            This layout is designed for desktop viewing only and is not
            responsive.
          </p>
        </div>

        {/* Second Column - Full Height */}
        <div className="flex h-full max-h-screen overflow-hidden">
          <ChatBox />
        </div>
      </div>

      {/* Session info in top-left corner */}
      <div className="absolute left-4 bottom-4 rounded-md bg-muted p-3 text-sm">
        <div>
          <strong>Email:</strong> {userEmail}
        </div>
        <div>
          <strong>Session ID:</strong> {sessionId}
        </div>
      </div>
    </div>
  );
}
