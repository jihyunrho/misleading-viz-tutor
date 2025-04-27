import { db } from "@/db"; // Adjust to your actual db path
import { appConfig } from "@/db/schema"; // Assuming this is your table
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import "dotenv/config";

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key not found");

  const openai = new OpenAI({ apiKey });

  // Step 1: Check for OPENAI_MODEL
  let model = "gpt-4o";
  const modelRow = await db.query.appConfig.findFirst({
    where: eq(appConfig.configKey, "OPENAI_MODEL"),
  });

  if (!modelRow || !modelRow.configValue) {
    console.log("🧠 No OPENAI_MODEL found. Inserting default model gpt-4o...");
    await db.insert(appConfig).values({
      configKey: "OPENAI_MODEL",
      configValue: model,
    });
  } else {
    model = modelRow.configValue;
    console.log(`✅ Found model in DB: ${model}`);
  }

  // Step 2: Check for OPENAI_ASSISTANT_ID
  const assistantRow = await db.query.appConfig.findFirst({
    where: eq(appConfig.configKey, "OPENAI_ASSISTANT_ID"),
  });

  if (assistantRow) {
    console.log(`✅ Assistant already exists: ${assistantRow.configValue}`);
    return;
  }

  console.log("⚙️ No assistant found. Creating a new one...");

  const assistant = await openai.beta.assistants.create({
    name: "Visualization Reasoning Tutor",
    model: "gpt-4o",
    instructions: `
    You are an AI tutor that helps students critically evaluate misleading data visualizations.

    The evaluation process comprises two main steps:
    1. First, you will help the student recognize the misleading feature embedded in the visualization. 
    If the student fails to identify the feature correctly, you will provide feedback and guidance until they succeed.
    2. Once the student correctly identifies the misleading feature, you will help them revise the flawed reasoning based on that feature.

    At the beginning, both you and the student will be presented with the flawed reasoning about a given misleading data visualization.
    You will ask the student to identify where the misleading feature exists within the visualization.
    If the student's response does not correctly refer to the misleading feature, provide constructive feedback to help them rethink their answer.

    After the student successfully recognizes the misleading feature, ask them how they would revise the flawed reasoning.
    Once the student suggests a revision, generate a revised version of the reasoning that reflects their suggestion.

    Finally, ask the student whether they are satisfied with the revised reasoning.
    - If the student says YES, encourage them and move on to the next activity.
    - If the student says NO, ask them again how they would like to revise the flawed reasoning.  
  `.trim(),
  });

  await db.insert(appConfig).values({
    configKey: "OPENAI_ASSISTANT_ID",
    configValue: assistant.id,
  });

  console.log(`🚀 Created new assistant with ID: ${assistant.id}`);
}

main().catch((err) => {
  console.error("❌ Error during assistant setup:", err);
  process.exit(1);
});
