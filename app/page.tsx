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
import { getTutorPages } from "@/data/visualization-images";
import createTutorSession from "@/app/actions/createTutorSession";
import { logUserAction } from "@/app/actions/logUserAction";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { getSessionData, setSession } = useTutorSessionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    const newErrors = { name: "", email: "" };
    let hasError = false;

    console.log(`name: ${name}, email: ${email}`);

    const participantUserAgent = navigator.userAgent;
    console.log("User Agent:", participantUserAgent);

    // FETCH user IP address using the http://ip-api.com/json/ endpoint
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();
    console.log();

    const participantIpAddr = data.query;
    console.log("Location:", data.city, data.country);

    // ADD A NEW ROW TO THE TUTOR_SESSIONS TABLE
    const createResult = await createTutorSession({
      participantName: name,
      participantEmail: email,
    });

    if (createResult.success && createResult.data) {
      const sessionId = createResult.data.sessionId;

      setSession({
        sessionId,
        ipAddr: participantIpAddr,
        userAgent: participantUserAgent,
        participantName: name,
        participantEmail: email,
        pages: getTutorPages(),
      });

      const sessionData = getSessionData();

      await logUserAction({
        sessionData,
        pageTitle: "Home",
        action: `Started Tutor Session ID ${sessionId} with name: ${name} and email: ${email}`,
      });
    }

    // If no errors, proceed
    if (!hasError) {
      // Initialize the tutor session

      // Navigate to pre-session page
      router.push("/pre-session");
    }

    setIsLoading(false);
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
              disabled={isLoading}
            >
              Start Tutor Session <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
