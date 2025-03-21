"use server";

import { readFile } from "fs/promises";
import path from "path";
import OpenAI from "openai";

/**
 * Server-side function to send a graph image to OpenAI for analysis
 * @param imagePath URL of the image to analyze
 * @param misleadingFeature The type of misleading feature in the visualization
 * @returns The AI's interpretation of the visualization
 */
export default async function getInitialIncorrectReasoning(
  imagePath: string,
  misleadingFeature: string
): Promise<string> {
  try {
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
            "You are an AI assistant that generates interpretations of data visualizations. \
            You fail to realize the existince of the misleading features within the graph and being deceived from the misleading visual features.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Provide a quick incorrect reasoning as the person who was severly deceived by the impact of ${misleadingFeature}.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${base64Image}` },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    // Extract the AI's message
    const aiMessage =
      response.choices[0]?.message?.content || "Error generating reasoning.";

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
