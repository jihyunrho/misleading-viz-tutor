export type ChatMessage = {
  role: "user" | "ai";
  type: "chat" | "hint";
  content: string;
};

export type TutorPage = {
  instruction: string;
  visualizationImage: VisualizationImage;
  firstIncorrectReasoning: string | null;
  messages: ChatMessage[];
};

export type TutorSession = {
  sessionId: string;
  userEmail: string;
  pages: TutorPage[];
  currentPageIndex: number;
};

export type VisualizationImage = {
  title: string;
  src: string;
};
