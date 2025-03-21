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
    <div className="min-h-screen bg-background">
      {/* Main container with flex for vertical centering */}
      <main className="flex min-h-screen  justify-center px-4 py-4">
        {/* Responsive two-column grid with full height */}
        <div className="grid h-[calc(100vh-2rem)] grid-cols-2 gap-4 items-center">
          <div className="flex flex-col">
            This is the first column of the layout
            <div className="relative">
              <img src="/images/visualizations/bar1_2.png" alt="Chart 1" />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              This layout is designed for desktop viewing only and is not
              responsive.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: March 2025
            </p>
          </div>

          {/* Second Column - Full Height */}
          <div className="flex h-full flex-col">
            <ChatBox />
          </div>
        </div>
      </main>

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
