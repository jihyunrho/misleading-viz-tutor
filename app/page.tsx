"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import { generateRandomTutorSessionId } from "@/lib/utils";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });
  const router = useRouter();
  const { setSession } = useTutorSessionStore();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors = { name: "", email: "" };
    let hasError = false;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      hasError = true;
    }

    setErrors(newErrors);

    // If no errors, proceed
    if (!hasError) {
      // Initialize the tutor session
      const sessionId = generateRandomTutorSessionId();
      setSession({
        sessionId,
        participantEmail: email,
        pages: [],
        currentPageIndex: 0,
      });

      // Navigate to pre-session page
      router.push("/pre-session");
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <div className="flex-1 h-full grid grid-cols-2">
        <div className="flex flex-col h-screen justify-center p-8 overflow-auto bg-neutral-100">
          <div>
            <h1 className="text-xl font-semibold">Misleading DataViz Tutor</h1>
            <p className="mt-4">
              This study is about how people reason about data visualizations.
              Your task is to explain why the chart is misleading to a chatbot.
            </p>
            <p className="mt-4">
              Enter your name and email. Click on the "Start Tutor Session"
              button when you're ready.
            </p>

            <Separator className="mt-8 mb-4" />
            <Badge className="rounded-xs bg-green-600 text-white inline-flex items-center">
              <Info className="h-4 w-4" />
              <span>Estimated Time</span>
            </Badge>
            <p className="mt-2">
              This study will take about <strong>one hour</strong>. You must
              finish the session in one sitting. You can't save your progress.
            </p>
          </div>
        </div>

        <div className="flex flex-col h-screen justify-center p-8 overflow-y-scroll">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="rounded-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="rounded-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="flex items-center gap-2 rounded-xs cursor-pointer bg-slate-900"
            >
              Start Tutor Session <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
