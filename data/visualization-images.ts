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
    initialIncorrectReasoning: "Drake has more than twice as many views as Eminem. That really shows how much more people are listening to him.",
  },
  {
    imageTitle: "Pie Chart of Covid-19 Worries",
    imageFilename: "over100_pie_covidworries.jpg",
    misleadingFeature: "over 100",
    initialIncorrectReasoning: "Looks like most people are way more worried about the economy than getting sick, just look how big that yellow slice is!",
  },
  {
    imageTitle: "Bar Chart of Number of Artists",
    imageFilename: "truncatedyaxis_bar_artists.jpg",
    misleadingFeature: "truncated y-axis",
    initialIncorrectReasoning: "Whoa, the number of artists making over $1M isn’t that different from those making over $10K—looks like maybe just 3 times more?",
  },
];
