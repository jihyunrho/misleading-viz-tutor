import { visualizationImages } from "@/data/visualization-images";
import { TutorPage } from "@/stores/tutorSessionStore";

export const tutorPagesData: TutorPage[] = visualizationImages.map((image) => ({
  instruction: `Explain why the chart titled "${image.imageTitle}" is misleading because of its ${image.misleadingFeature}.`,
  imageTitle: image.imageTitle,
  imageFilename: image.imageFilename,
  misleadingFeature: image.misleadingFeature,
  initialIncorrectReasoning: image.initialIncorrectReasoning,
  messages: [
    {
      role: "instruction",
      type: "instruction",
      content: `Explain why the AI chatbot's first interpretation of the ${image.imageTitle} is incorrect.`,
    },
  ],
}));
