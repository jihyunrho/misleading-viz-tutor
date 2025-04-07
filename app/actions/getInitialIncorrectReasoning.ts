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
 * Gets the initial incorrect reasoning about a visualization that is purposefully misleading
 *
 * @param params - Object containing visualization details
 * @param params.imageTitle - Title of the visualization being analyzed
 * @param params.imageFilename - Name of the visualization image file
 * @param params.misleadingFeature - The specific misleading element in the visualization
 *
 * @returns A string containing the intentionally incorrect interpretation of the visualization
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
    } else {
      return "Image metadata not found in database.";
    }
  } catch (error) {
    console.error("❌ Error fetching cached reasoning:", error);
  }

  return "Failed to generate reasoning.";
}
