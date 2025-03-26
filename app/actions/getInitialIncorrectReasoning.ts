"use server";

import path from "path";
import OpenAI from "openai";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { visualizationImagesTable } from "@/db/schema";
import { getBaseUrl } from "@/app/actions/getBaseUrl";
import getGitHubImageUrl from "@/lib/get-github-image-url";

type FunctionParams = {
  imageTitle: string;
  imageFilename: string;
  misleadingFeature: string;
};

/**
 * Generates an initial incorrect reasoning about a visualization that is purposefully misleading
 *
 * This server action first checks if a cached reasoning exists for the given image in the database.
 * If found, it returns the cached result to avoid redundant API calls. If not found, it sends the
 * visualization to OpenAI's GPT-4o model to generate an incorrect interpretation that is deceived
 * by the misleading feature, then caches the result for future use.
 *
 * @param params - Object containing visualization details
 * @param params.imageTitle - Title of the visualization being analyzed
 * @param params.imageFilename - Name of the visualization image file
 * @param params.misleadingFeature - The specific misleading element in the visualization
 *
 * @returns A string containing the AI's intentionally incorrect interpretation of the visualization
 * @throws Error if the OpenAI API key is not configured or if the API request fails
 */
export default async function getInitialIncorrectReasoning(
  params: FunctionParams
): Promise<string> {
  const filename = path.basename(params.imageFilename);

  try {
    const result = await db
      .select()
      .from(visualizationImagesTable)
      .where(eq(visualizationImagesTable.filename, filename))
      .limit(1);

    console.log(`✅ Fetched cached reasoning for ${filename}:`, result);

    if (result.length > 0) {
      let cachedReasoning = result[0].initialIncorrectReasoning;
      return cachedReasoning!;
    }
  } catch (error) {
    console.error("❌ Error fetching cached reasoning:", error);
  }

  // If no cached reasoning, generate a new one using OpenAI
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }

    const openai = new OpenAI({
      apiKey,
    });

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
              text: `Here is a visualization titled ${params.imageTitle} Provide a quick incorrect reasoning as from a point of view of a person who was severly deceived by the impact of ${params.misleadingFeature}.`,
            },
            {
              type: "image_url",
              image_url: {
                url: getGitHubImageUrl(params.imageFilename),
              },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    // Extract the AI's message
    const aiMessage = response.choices[0]?.message?.content;

    if (aiMessage) {
      await db.insert(visualizationImagesTable).values({
        filename,
        misleadingFeature: params.misleadingFeature,
        imageTitle: params.imageTitle,
        initialIncorrectReasoning: aiMessage,
      });
      return aiMessage;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ OpenAI API Error:", error.message);
    } else {
      console.error("❌ OpenAI API Error:", error);
    }
    throw error;
  }

  return "Failed to generate reasoning";
}
