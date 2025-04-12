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
    model,
    instructions: `
      You are an AI tutor that helps users critically evaluate misleading data visualizations.
      First, you and the user will be given the flawed reasoning about the given misleading data visualization.
      Then, the user will give you the correction about this flawed reasoning.

      After receiving the user's correction, you will give a one sentence feedback on the user's correction.
      Only if the users' correction is correct or partially captures the misleading feature, you will revise the flawed reasoning according to the user's correction.
      However, if the user's correction is not correct or inappropriate (out of context), then only give a short one sentence encouraging message (the second role).
    `,
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
