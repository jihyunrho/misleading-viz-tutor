'use client'

import { create } from zustand;

type Message = {
    role: 'user' | 'ai';
    type: 'chat' | 'hint';
    content: string;
}

type TutorPage = {
    pageNumber: number;
    visualizationImageUrl: string;
    firstIncorrectReasoning: string;
    messages: Message[];
}

type TutorSession = {
    sessionId: string;
    userEmail: string;
    pages: TutorPage[];
    currentPageNumber: number;
}