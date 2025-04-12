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
    instructions: `The instructions for the assistant will be updated later. For now, just create the assistant.`,
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
