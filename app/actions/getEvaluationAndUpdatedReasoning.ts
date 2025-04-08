"use server";

import OpenAI from "openai";
import getGitHubImageUrl from "@/lib/getGitHubImageUrl";
import { getOrCreateThreadId } from "@/app/actions/getOrCreateThreadId";

type FunctionParams = {
  sessionId: string;
  imageTitle: string;
  imageFilename: string;
  misleadingFeature: string;
  initialIncorrectReasoning: string;
  userCorrection: string;
};

type EvaluationResult = {
  assistantFeedback: string;
  chatbotReasoning: string;
};

export default async function getEvaluationAndUpdatedReasoning(
  params: FunctionParams
): Promise<EvaluationResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not found");

    const openai = new OpenAI({ apiKey });

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
      `,
    });

    const threadId = await getOrCreateThreadId({
      sessionId: params.sessionId,
      imageFilename: params.imageFilename,
    });

    // 1. Generating the flawed reasoning message
    const flawedPrompt = `
      You are a misled person who is deceived by ${params.misleadingFeature} in this ${params.imageTitle} and make a flawed decision.
      Say one sentence flawed reasoning about this misleading visualization as you are misled by the impact of ${params.misleadingFeature}.
      Do not mention the exact number or values in the visualization in your flawed reasoning, but just a typical flawed reasoning as the person who is deceived by the impact of ${params.misleadingFeature}.
      Do not say like "one might assume incorrectly~", you are role playing a person who is not good at correct reasoning for misleading visualization.
    `;

    await openai.beta.threads.messages.create(threadId, {
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
    });

    // 2. 사용자 교정 입력
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: params.userCorrection,
    });

    // 3. 평가 및 reasoning 수정 요청
    const evalPrompt = `
      Evaluate the user's correction: "${params.userCorrection}".
      If they correctly or partially catch the ${params.misleadingFeature} and the impact of ${params.misleadingFeature}, acknowledge it briefly (1 sentence) but do not explicitly give a hint (or mention a misleading feature). -- no direct answer.
      Then, in a new paragraph, based on "${params.userCorrection}" to the impact of ${params.misleadingFeature}, provide a revised version of the ${params.initialIncorrectReasoning} according to ${params.userCorrection}. The revised reasoning should starting by "Revised Flawed Reasoning: ".
      
      However, if the user's correction is wrong, incorrect, vague, or out of context, then give encouraging message (1 sentence) with little thin level of scaffolding for correction, but do not explicitly give hint. -- no direct answer.
      Here, do not provide any revision for the original flawed reasoning.
    `;

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: evalPrompt,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
    });

    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      await new Promise((res) => setTimeout(res, 1000));
    } while (runStatus.status !== "completed");

    const messages = await openai.beta.threads.messages.list(threadId);
    const firstContent = messages.data[0].content[0];
    const fullText = "text" in firstContent ? firstContent.text.value : "";

    const [feedback, reasoning] = fullText.split("Revised Flawed Reasoning:");

    return {
      assistantFeedback: feedback?.trim() || "No feedback received.",
      chatbotReasoning: reasoning
        ? "Revised Flawed Reasoning: " + reasoning.trim()
        : "No revised reasoning.",
    };
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    throw error;
  }
}
