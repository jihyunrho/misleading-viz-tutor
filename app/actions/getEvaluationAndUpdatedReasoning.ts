"use server";

import { readFile } from "fs/promises";
import path from "path";
import OpenAI from "openai";

/**
 * Server-side function to send a graph image to OpenAI for analysis
 * @param imageUrl URL of the image to analyze
 * @param misleadingFeature The type of misleading feature in the visualization
 * @returns The AI's interpretation of the visualization
 */
export default async function getEvaluationAndUpdatedReasoning(
  imagePath: string,
  misleadingFeature: string,
  aiIncorrectReasoning: string,
  userCorrection: string
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
    const absoluteImagePath = path.join(process.cwd(), "public", imagePath);
    const imageBuffer = await readFile(absoluteImagePath);
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a tutor AI who evaluates corrections and improves the reasoning accordingly.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `AI's incorrect reasoning was: \"${aiIncorrectReasoning}\". The user provided the correction: \"${userCorrection}\". \
              First, evaluate the correction and give feedback in one sentence. Then revise the reasoning accordingly.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${base64Image}` },
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
