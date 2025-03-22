"use client";

import { ChatMessage, TutorPage, TutorSession } from "@/types";
import { create } from "zustand";

// Store type
type TutorSessionState = {
  session: TutorSession | null;
  setSession: (session: TutorSession) => void;
  addMessage: (message: ChatMessage) => void;
  nextPage: () => void;
  prevPage: () => void;
  updateInstruction: (instruction: string) => void;
};

export const useTutorSessionStore = create<TutorSessionState>((set, get) => ({
  session: null,

  setSession: (session: TutorSession) => {
    set({ session });
  },

  addMessage: (message: ChatMessage) => {
    const session = get().session;
    if (!session) return;

    const { currentPageIndex, pages } = session;
    const updatedPages = [...pages];
    const currentPage = updatedPages[currentPageIndex];

    const updatedPage: TutorPage = {
      ...currentPage,
      messages: [...currentPage.messages, message],
    };

    updatedPages[currentPageIndex] = updatedPage;

    set({
      session: {
        ...session,
        pages: updatedPages,
      },
    });
  },

  updateInstruction: (instruction: string) => {
    const session = get().session;
    if (!session) return;

    const { currentPageIndex, pages } = session;
    const updatedPages = [...pages];
    const currentPage = updatedPages[currentPageIndex];

    const updatedPage: TutorPage = {
      ...currentPage,
      instruction,
    };

    updatedPages[currentPageIndex] = updatedPage;

    set({
      session: {
        ...session,
        pages: updatedPages,
      },
    });
  },

  nextPage: () => {
    const session = get().session;
    if (!session) return;

    const nextIndex = Math.min(
      session.currentPageIndex + 1,
      session.pages.length - 1
    );
    if (nextIndex === session.currentPageIndex) return; // already at last page

    set({
      session: {
        ...session,
        currentPageIndex: nextIndex,
      },
    });
  },

  prevPage: () => {
    const session = get().session;
    if (!session) return;

    const prevIndex = Math.max(session.currentPageIndex - 1, 0);
    if (prevIndex === session.currentPageIndex) return; // already at first page

    set({
      session: {
        ...session,
        currentPageIndex: prevIndex,
      },
    });
  },
}));
