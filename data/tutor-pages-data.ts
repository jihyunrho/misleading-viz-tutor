import { visualizationImages } from "@/data/visualization-images";
import { TutorPage } from "@/types";

export const tutorPagesData: TutorPage[] = visualizationImages.map((image) => ({
  instruction: `Explain why the chart titled "${image.imageTitle}" is misleading because of its ${image.misleadingFeature}.`,
  imageTitle: image.imageTitle,
  imageFilename: image.imageFilename,
  misleadingFeature: image.misleadingFeature,
  initialIncorrectReasoning: image.initialIncorrectReasoning,
}));
