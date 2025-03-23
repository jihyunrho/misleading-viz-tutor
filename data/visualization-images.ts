import { TutorPage } from "@/stores/tutorSessionStore";
import { VisualizationImage } from "@/types";

// A filename must be unique
// For example, you cannot have two images with the same filename in different directories
export const visualizationImages: VisualizationImage[] = [
  {
    imageTitle: "3D Pie Chart of Mobile Devices Market Share",
    imageSrc: "/images/visualizations/3d_pie_phones.png",
    misleadingFeature: "3D effect",
  },
  {
    imageTitle: "Bar Chart of Bicycle Sales by Year",
    imageSrc: "/images/visualizations/bar_year_bicycles.png",
    misleadingFeature: "truncated y-axis",
  },
  {
    imageTitle: "Line Chart of Turtles by Year",
    imageSrc: "/images/visualizations/line_year_turtles.png",
    misleadingFeature: "truncated y-axis",
  },
];

export function getTutorPages(): TutorPage[] {
  return visualizationImages.map((image) => ({
    instruction: `Explain why the chart titled "${image.imageTitle}" is misleading because of its ${image.misleadingFeature}.`,
    imageTitle: image.imageTitle,
    imageSrc: image.imageSrc,
    misleadingFeature: image.misleadingFeature,
    firstIncorrectReasoning: null,
    messages: [],
  }));
}
