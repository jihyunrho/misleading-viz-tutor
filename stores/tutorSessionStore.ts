"use client";
import { create } from "zustand";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
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

// Core session data
export type TutorSessionData = {
  sessionId: string;
  ipAddr: string | null;
  userAgent: string | null;
  participantName: string;
  participantEmail: string;
  startTime: string;
  endTime: string | null;
  pages: TutorPage[];
  currentPageIndex: number;
};

// Store type extends the data with methods
type TutorSessionStore = TutorSessionData & {
  // Methods
  setSession: (session: Partial<TutorSessionData>) => void;
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
  getSessionData: () => TutorSessionData;
};

const initialState: TutorSessionData = {
  sessionId: "",
  ipAddr: null,
  userAgent: null,
  participantName: "",
  participantEmail: "",
  startTime: "",
  endTime: null,
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

  getSessionData: () => {
    const state = get();
    return {
      sessionId: state.sessionId,
      ipAddr: state.ipAddr,
      userAgent: state.userAgent,
      participantName: state.participantName,
      participantEmail: state.participantEmail,
      startTime: state.startTime,
      endTime: state.endTime,
      pages: state.pages,
      currentPageIndex: state.currentPageIndex,
    };
  },
}));
