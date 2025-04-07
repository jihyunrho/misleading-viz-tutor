import { VisualizationImage } from "@/types";

// A filename must be unique
// For example, you cannot have two images with the same filename in different directories
export const visualizationImages: VisualizationImage[] = [
  {
    imageTitle: "Line Chart of Gun Death Rate",
    imageFilename: "invertedyaxis_line_gundeath.jpg",
    misleadingFeature: "inverted y-axis",
    initialIncorrectReasoning:
      "Wow, it looks like gun deaths have dramatically decreased over time, especially after the 'Stand Your Ground' law was enacted in 2005. This law must have been really effective in reducing firearm-related murders in Florida!",
  },
  {
    imageTitle: "Bar Chart of Artists' sales",
    imageFilename: "manipulatedxaxis_bar_artistsales.jpg",
    misleadingFeature: "manipulated x-axis",
    initialIncorrectReasoning: "To be filled in later",
  },
  {
    imageTitle: "Pie Chart of Covid-19 Worries",
    imageFilename: "over100_pie_covidworries.jpg",
    misleadingFeature: "over 100",
    initialIncorrectReasoning: "To be filled in later",
  },
];
