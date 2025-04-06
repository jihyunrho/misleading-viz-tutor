"use server";

import path from "path";
import OpenAI from "openai";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { visualizationImagesTable } from "@/db/schema";
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

  // 1. 먼저 캐시 확인 (DB 조회)
  try {
    const result = await db
      .select()
      .from(visualizationImagesTable)
      .where(eq(visualizationImagesTable.filename, filename))
      .limit(1);

    if (result.length > 0) {
      const cachedReasoning = result[0].initialIncorrectReasoning;
      console.log(`✅ Loaded cached flawed reasoning for ${filename}`);
      return cachedReasoning!;
    }
  } catch (error) {
    console.error("❌ Error fetching cached reasoning:", error);
  }

  // 2. 없으면 OpenAI로 새로 생성
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }

    const openai = new OpenAI({ apiKey });

    const flawedPrompt = `You are a misled person who is deceived by ${params.misleadingFeature} in this ${params.imageTitle} and makes a flawed decision.
      Say two sentences of typical flawed reasoning about this misleading visualization that are expected in situation when you are misled by the impact of ${params.misleadingFeature} and context of this visualization.
      Do not mention the exact number or values in the visualization in your flawed reasoning, but just a typical flawed reasoning as the person who is deceived by the impact of ${params.misleadingFeature}.
      Do not say like "one might assume incorrectly~", you are role playing a person who is not good at correct reasoning for misleading visualization.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: flawedPrompt },
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

    const aiMessage = response.choices[0]?.message?.content?.trim();

    if (aiMessage) {
      // 저장
      await db.insert(visualizationImagesTable).values({
        filename,
        misleadingFeature: params.misleadingFeature,
        imageTitle: params.imageTitle,
        initialIncorrectReasoning: aiMessage,
      });
      console.log(`💾 Cached new flawed reasoning for ${filename}`);
      return aiMessage;
    }
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    throw error;
  }

  return "Failed to generate reasoning.";
}