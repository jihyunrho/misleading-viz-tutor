"use client";
import { create } from "zustand";

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
  misleadingFeature: string;
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
  updateCurrentPage: (pageUpdates: Partial<TutorPage>) => void;
  currentPage: () => TutorPage | null;
  currentPageNumber: () => number;
  isLastPage: () => boolean;
  resetSession: () => void;
  endSession: () => void;
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

export const useTutorSessionStore = create<TutorSessionStore>((set, get) => ({
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
    const currentPage = get().currentPage();

    if (!currentPage) {
      console.warn("Tried to add message, but no current page exists.");
      return;
    }

    const { pages, currentPageIndex } = get();
    const updatedPages = [...pages];

    updatedPages[currentPageIndex] = {
      ...currentPage,
      messages: [...(currentPage.messages || []), message],
    };

    set({ pages: updatedPages });
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
    const currentPage = get().currentPage();

    if (!currentPage) {
      console.warn("Tried to update instruction, but no current page exists.");
      return;
    }

    const { pages, currentPageIndex } = get();
    const updatedPages = [...pages];

    updatedPages[currentPageIndex] = {
      ...currentPage,
      instruction,
    };

    set({ pages: updatedPages });
  },

  updateCurrentPage: (pageUpdates: Partial<TutorPage>) => {
    const currentPage = get().currentPage();

    if (!currentPage) {
      console.warn("Tried to update page, but no current page exists.");
      return;
    }

    const { pages, currentPageIndex } = get();
    const updatedPages = [...pages];

    updatedPages[currentPageIndex] = {
      ...currentPage,
      ...pageUpdates,
    };

    set({ pages: updatedPages });
  },

  // Derived getter
  currentPage: () => {
    const { pages, currentPageIndex } = get();
    return pages.length > 0 && currentPageIndex < pages.length
      ? pages[currentPageIndex]
      : null;
  },

  currentPageNumber: () => {
    const { pages, currentPageIndex } = get();
    return pages.length > 0 && currentPageIndex < pages.length
      ? currentPageIndex + 1
      : -1;
  },

  isLastPage: () => {
    const { pages, currentPageIndex } = get();
    return currentPageIndex === pages.length - 1;
  },

  resetSession: () => {
    set({ ...initialState });
  },

  endSession: () => {
    set({ endTime: new Date().toISOString() });
  },
}));
