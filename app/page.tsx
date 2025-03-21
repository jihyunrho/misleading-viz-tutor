"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <div className="flex-1 h-full grid grid-cols-2">
        <div className="flex flex-col h-screen justify-center p-8 overflow-auto bg-slate-100 text-slate-500">
          <div>
            <h1 className="text-xl font-semibold text-slate-700">
              Misleading DataViz Tutor
            </h1>
            <p className="mt-4">
              This study is about how people reason about data visualizations.
              Your task is to explain why the chart is misleading.
            </p>
            <p className="mt-4">
              Enter your name and email. Click on the "Start Tutor Session"
              button when you're ready.
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
