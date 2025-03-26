import { visualizationImages } from "@/data/visualization-images";
import { TutorPage } from "@/stores/tutorSessionStore";

export function getTutorPages(): TutorPage[] {
  return visualizationImages.map((image) => ({
    instruction: `Explain why the chart titled "${image.imageTitle}" is misleading because of its ${image.misleadingFeature}.`,
    imageTitle: image.imageTitle,
    imageFilename: image.imageFilename,
    misleadingFeature: image.misleadingFeature,
    firstIncorrectReasoning: null,
    messages: [
      {
        role: "instruction",
        type: "instruction",
        content: `Explain why the AI's first interpretation of the ${image.imageTitle} is incorrect.`,
      },
    ],
  }));
}
