"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  role: "user" | "bot";
  type: "user" | "bot-reasoning" | "bot-evaluation";
  content: string;
  createdAt: string;
};

export type TutorPage = {
  instruction: string;
  imageTitle: string;
  imageSrc: string;
  firstIncorrectReasoning: string | null;
  messages: ChatMessage[];
};

export type TutorSession = {
  sessionId: string;
  participantName: string;
  participantEmail: string;
  pages: TutorPage[];
  currentPageIndex: number;
};

// Store type
type TutorSessionStore = {
  sessionId: string;
  participantName: string;
  participantEmail: string;
  startTime: string;
  endTime: string;
  pages: TutorPage[];
  currentPageIndex: number;
  setSession: (session: Partial<TutorSessionStore>) => void;
  addMessage: (message: ChatMessage) => void;
  nextPage: () => void;
  prevPage: () => void;
  updateInstruction: (instruction: string) => void;
  resetSession: () => void;
};

const initialState = {
  sessionId: "",
  participantName: "",
  participantEmail: "",
  startTime: "",
  endTime: "",
  pages: [],
  currentPageIndex: 0,
};

export const useTutorSessionStore = create<TutorSessionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSession: (session) => {
        set((state) => ({
          ...state,
          ...session,
          startTime:
            state.startTime || session.startTime || new Date().toISOString(),
        }));
      },

      addMessage: (message) => {
        const { pages, currentPageIndex } = get();

        if (pages.length === 0 || currentPageIndex >= pages.length) {
          console.warn("Tried to add message, but no pages exist.");
          return;
        }

        const updatedPages = [...pages];
        const currentPage = { ...updatedPages[currentPageIndex] };

        currentPage.messages = [...(currentPage.messages || []), message];
        updatedPages[currentPageIndex] = currentPage;

        set({ pages: updatedPages });
      },

      // 🆕 Derived getter
      currentPage: () => {
        const { pages, currentPageIndex } = get();
        return pages.length > 0 && currentPageIndex < pages.length
          ? pages[currentPageIndex]
          : null;
      },

      nextPage: () => {
        const { currentPageIndex, pages } = get();

        if (currentPageIndex < pages.length - 1) {
          set({ currentPageIndex: currentPageIndex + 1 });
        }
      },

      prevPage: () => {
        const { currentPageIndex } = get();

        if (currentPageIndex > 0) {
          set({ currentPageIndex: currentPageIndex - 1 });
        }
      },

      updateInstruction: (instruction) => {
        const { pages, currentPageIndex } = get();

        if (pages.length === 0 || currentPageIndex >= pages.length) {
          console.warn("Tried to update instruction, but no pages exist.");
          return;
        }

        if (pages.length === 0 || currentPageIndex >= pages.length) {
          return;
        }

        const updatedPages = [...pages];
        const currentPage = { ...updatedPages[currentPageIndex] };

        currentPage.instruction = instruction;
        updatedPages[currentPageIndex] = currentPage;

        set({ pages: updatedPages });
      },

      endSession: () => set({ endTime: new Date().toISOString() }),

      resetSession: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "tutor-session-storage",
      skipHydration: true,
    }
  )
);
