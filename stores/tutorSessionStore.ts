"use client";
import { create } from "zustand";
import { tutorPagesData } from "@/data/tutor-pages-data";
import {
  TutorPage,
  ChatMessage,
  ChatMessageInsertWithMeta,
  ChatMessageForView,
} from "@/types";

// Core session data
export type TutorSessionData = {
  sessionId: string;
  ipAddr: string | null;
  userAgent: string | null;
  participantName: string;
  participantEmail: string;
  startedAt: Date | null;
  endedAt: Date | null;
  currentPageIndex: number;
  messages: ChatMessageForView[];
  isWaitingForChatbotResponse: boolean;
};

// Store type extends the data with methods
type TutorSessionStore = TutorSessionData & {
  // Methods
  setSession: (session: Partial<TutorSessionData>) => void;
  nextPage: () => void;
  prevPage: () => void;
  currentPage: () => TutorPage | null;
  currentPageNumber: () => number;
  isLastPage: () => boolean;
  getSessionData: () => TutorSessionData;
  addMessage: (messageInput: ChatMessageInsertWithMeta) => void;
  replaceMessage: (tempId: string, newMessage: ChatMessage) => void;
  currentMessages: () => ChatMessageForView[];
};

const initialState: TutorSessionData = {
  sessionId: "",
  ipAddr: null,
  userAgent: null,
  participantName: "",
  participantEmail: "",
  startedAt: null,
  endedAt: null,
  currentPageIndex: -1,
  messages: [],
  isWaitingForChatbotResponse: false,
};

// Should use the useTutorSession to hydrate from the Database
export const _useTutorSessionStore = create<TutorSessionStore>((set, get) => ({
  ...initialState,

  setSession: (session) => {
    set((state) => ({
      ...state,
      ...session,
      startedAt: state.startedAt || session.startedAt || new Date(),
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

  getSessionData: () => {
    const state = get();
    return {
      sessionId: state.sessionId,
      ipAddr: state.ipAddr,
      userAgent: state.userAgent,
      participantName: state.participantName,
      participantEmail: state.participantEmail,
      startedAt: state.startedAt,
      endedAt: state.endedAt,
      currentPageIndex: state.currentPageIndex,
      messages: state.messages,
      isWaitingForChatbotResponse: state.isWaitingForChatbotResponse,
    };
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  replaceMessage: (tempId, newMessage) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        "tempId" in msg && msg.tempId === tempId ? newMessage : msg
      ),
    }));
  },

  currentMessages: () => {
    const { currentPage, messages } = get();

    return messages.filter(
      (msg) => msg.imageTitle === currentPage()?.imageTitle
    );
  },
}));
