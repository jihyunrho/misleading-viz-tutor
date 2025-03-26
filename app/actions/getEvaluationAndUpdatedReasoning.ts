"use server";

import OpenAI from "openai";
import { getBaseUrl } from "@/app/actions/getBaseUrl";

type FunctionParams = {
  imageTitle: string;
  imageFilename: string;
  misleadingFeature: string;
  firstIncorrectReasoning: string;
  userCorrection: string;
};

/**
 * Evaluates a user's correction to a misleading visualization reasoning and provides updated feedback
 *
 * This server action takes information about a visualization, an initial incorrect reasoning,
 * and the user's attempted correction. It then uses OpenAI's GPT-4o to generate an evaluation
 * of the user's correction along with an improved reasoning about the visualization.
 *
 * @param params - Object containing visualization details and user interaction data
 * @param params.imageTitle - Title of the visualization being analyzed
 * @param params.imageFilename - Name of the visualization image file
 * @param params.misleadingFeature - The specific misleading element in the visualization
 * @param params.firstIncorrectReasoning - The initial incorrect reasoning shown to the user
 * @param params.userCorrection - The user's attempt to correct the reasoning
 *
 * @returns A string containing the AI's evaluation of the correction and revised reasoning
 * @throws Error if the OpenAI API key is not configured or if the API request fails
 */
export default async function getEvaluationAndUpdatedReasoning(
  params: FunctionParams
): Promise<string> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }

    const openai = new OpenAI({
      apiKey,
    });

    // Fetch the image
    const baseUrl = await getBaseUrl();
    const imageUrl = `${baseUrl}/images/visualizations/${params.imageFilename}`;
    const res = await fetch(imageUrl);
    const imageBuffer = await res.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "The user is interacting with an AI assistant that is purposefully providing an incorrect reasoning of a visualization. The user attmpts to correct the AI assistant's incorrect reasoning. You are a tutor AI who evaluates corrections and improves the reasoning accordingly.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Here is a visualization titled ${params.imageTitle} Provide a quick incorrect reasoning as from a point of view of a person who was severly deceived by the impact of ${params.misleadingFeature}.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${base64Image}` },
            },
          ],
        },
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: params.firstIncorrectReasoning,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: params.userCorrection,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "First, evaluate the correction and give feedback in one sentance. In the next paragraph, revise the reason accordingly.",
            },
          ],
        },
      ],
      temperature: 0.5,
    });

    // Extract the AI's message
    const aiMessage =
      response.choices[0]?.message?.content ||
      "Error generating a response from OpenAI.";

    return aiMessage;
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ OpenAI API Error:", error.message);
    } else {
      console.error("❌ OpenAI API Error:", error);
    }
    throw error;
  }
}
