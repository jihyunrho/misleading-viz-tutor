"use client";
import { create } from "zustand";
import { tutorPagesData } from "@/data/tutor-pages-data";

export type ChatMessage = {
  role: "system" | "user" | "assistant" | "chatbot" | "instruction";
  type: "user" | "assistant-feedback" | "chatbot-reasoning" | "instruction";
  content: string;
  createdAt?: string;
};

export type TutorPage = {
  instruction: string;
  imageTitle: string;
  imageFilename: string;
  misleadingFeature: string;
  initialIncorrectReasoning: string | null;
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
  currentPageIndex: number;
  messages: ChatMessage[];
};

// Store type extends the data with methods
type TutorSessionStore = TutorSessionData & {
  // Methods
  setSession: (session: Partial<TutorSessionData>) => void;
  addMessage: (message: ChatMessage) => void;
  nextPage: () => void;
  prevPage: () => void;
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
  currentPageIndex: 0,
  messages: [],
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
    const messageWithTimestamp = {
      ...message,
      createdAt: message.createdAt || new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, messageWithTimestamp],
    }));
  },

  nextPage: () => {
    const { currentPageIndex } = get();
    if (currentPageIndex < tutorPagesData.length - 1) {
      set({ currentPageIndex: currentPageIndex + 1 });
    }
  },

  prevPage: () => {
    const { currentPageIndex } = get();
    if (currentPageIndex > 0) {
      set({ currentPageIndex: currentPageIndex - 1 });
    }
  },

  currentPage: () => {
    const { currentPageIndex } = get();
    return tutorPagesData[currentPageIndex] || null;
  },

  currentPageNumber: () => {
    const { currentPageIndex } = get();
    return tutorPagesData.length > 0 && currentPageIndex < tutorPagesData.length
      ? currentPageIndex + 1
      : -1;
  },

  isLastPage: () => {
    const { currentPageIndex } = get();
    return currentPageIndex === tutorPagesData.length - 1;
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
      currentPageIndex: state.currentPageIndex,
      messages: state.messages,
    };
  },
}));
