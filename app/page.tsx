"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Hourglass, Info, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
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
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="rounded-xs"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="rounded-xs"
                required
              />
            </div>

            <Button
              type="submit"
              className="flex items-center gap-2 rounded-xs cursor-pointer bg-slate-900"
            >
              Start Tutor Session <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
