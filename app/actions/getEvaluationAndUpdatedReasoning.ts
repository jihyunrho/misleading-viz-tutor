"use server";

import OpenAI from "openai";
import getGitHubImageUrl from "@/lib/get-github-image-url";

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

    // Generate Assistant
    const response = await openai.beta.assistants.create({
      name: "Visualization Reasoning Tutor",
      model: "gpt-4o",
      instructions: `
        You are an AI tutor that helps users critically evaluate misleading data visualizations.\
        Begin with a flawed reasoning based on an explicit misleading feature in a chart.\
        Then, the user will suggest where to correct in your flawed reasoning.\
        Then, first, evaluate the user's suggestion and update and revise the exact part that the user point out.`
    });
    
    // Generate thread
    const thread = await openai.beta.threads.create();

    // Ask additional request

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Here is a visualization titled ${params.imageTitle}.\
                Provide a quick flawed reasoning in two sentences \
                as you are a person \
                who was severly deceived by the impact of ${params.misleadingFeature} and \
                hastly make a flawed decision.`,
      attachments: [
        {
          file_id: await getGitHubImageUrl(params.imageFilename),
          type: "image"
        }
      ]
    })

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: params.userCorrection
    })

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `First, evaluate the user's correction: "${params.userCorrection}" whether they catch the misleading features.\
      If they fail to catch the misleading feature and did not provide appropriate correction, then do not revise your original flawed reasoning.\
      Just give one or two sentences of guidance.\
      However, if the user's correction seems like to come very close to catch the misleading feature or correctly catch the misleading feature, \
      then give the corresponding message and revise the flawed reasoning: "${params.firstIncorrectReasoning}" accordingly.`
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: response.id
    })

    let runStatus;

    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise (res=> setTimeout(res, 1000));
    } while(runStatus.status !== "completed");

    const messages = await openai.beta.threads.messages.list(thread.id);
    const finalMessage = messages.data[0].content[0].text.value;

    return finalMessage;

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ OpenAI API Error:", error.message);
    } else {
      console.error("❌ OpenAI API Error:", error);
    }
    throw error;
  }
}
