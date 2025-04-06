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

type EvaluationResult = {
  assistantFeedback: string;
  chatbotReasoning: string;
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
): Promise<EvaluationResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not found");

    const openai = new OpenAI({ apiKey });

    // Assistant 생성 (개발 단계에서는 매번 생성해도 되고, 나중에는 ID 재사용 추천)
    const assistant = await openai.beta.assistants.create({
      name: "Visualization Reasoning Tutor",
      model: "gpt-4o",
      instructions: `
        You are an AI tutor that helps users critically evaluate misleading data visualizations.
        First, generate a flawed reasoning about the given misleading data visualization.
        Then, the user will give you the correction.
        
        After receiving the user's correction, you will give a one sentence feedback on the user's correction. 
        Only if when the users' correction is correct or partially capture the misleading feature, you will revise your previously flawed reasoning according to the user's correction.
        However, if the user's correction is not correct or inappropriate (out of context), then only give a short one sentence encouraging message (the second role).
      `
    });

    const thread = await openai.beta.threads.create();

    // 1. Generating the flawed reasoning message
    const flawedPrompt = `
      You are a misled person who is deceived by ${params.misleadingFeature} in this ${params.imageTitle} and makes a flawed decision.
      Say one sentence flawed reasoning about this misleading visualization as you are misled by the impact of ${params.misleadingFeature}.
      Do not mention the exact number or values in the visualization in your flawed reasoning, but just a typical flawed reasoning as the person who is deceived by the impact of ${params.misleadingFeature}.
      Do not say like "one might assume incorrectly~", you are role playing a person who is not good at correct reasoning for misleading visualization.
    `;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: [
        { type: "text", text: flawedPrompt },
        {
          type: "image_url",
          image_url: {
            url: getGitHubImageUrl(params.imageFilename)
          }
        }
      ]
    });

    // 2. 사용자 교정 입력
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: params.userCorrection
    });

    // 3. 평가 및 reasoning 수정 요청
    const evalPrompt = `
      Evaluate the user's correction: "${params.userCorrection}".
      If they correctly or partially catch the ${params.misleadingFeature} and the impact of ${params.misleadingFeature}, acknowledge it briefly (1 sentence) but do not explicitly give a hint (or mention a misleading feature). -- no direct answer.
      Then, in a new paragraph, based on "${params.userCorrection}" to the impact of ${params.misleadingFeature}, provide a revised version of the ${params.firstIncorrectReasoning} according to ${params.userCorrection}. The revised reasoning should starting by "Revised Flawed Reasoning: ".
      
      However, if the user's correction is wrong, incorrect, vague, or out of context, then give encouraging message (1 sentence) with little thin level of scaffolding for correction, but do not explicitly give hint. -- no direct answer.
      Here, do not provide any revision for the original flawed reasoning.
    `;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: evalPrompt
    });

    // Assistant 실행
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });

    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise(res => setTimeout(res, 1000));
    } while (runStatus.status !== "completed");

    const messages = await openai.beta.threads.messages.list(thread.id);
    const fullText = messages.data[0].content[0].text.value;

    // "Revised Flawed Reasoning:" 기준으로 두 부분 분리
    const [feedback, reasoning] = fullText.split("Revised Flawed Reasoning:");

    return {
      assistantFeedback: feedback?.trim() || "No feedback received.",
      chatbotReasoning: reasoning ? "Revised Flawed Reasoning: " + reasoning.trim() : "No revised reasoning."
    };
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    throw error;
  }
}