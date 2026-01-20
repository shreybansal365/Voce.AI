import "server-only";
import { OpenRouter } from "@openrouter/sdk";

const DEFAULT_MODEL = "deepseek/deepseek-r1";

export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  return new OpenRouter({ apiKey });
}

export function getOpenRouterModel() {
  return process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

export async function streamChatToText({ messages, model }) {
  const openrouter = getOpenRouterClient();
  const stream = await openrouter.chat.send({
    chatGenerationParams: {
      model: model || getOpenRouterModel(),
      messages,
      stream: true,
    },
  });

  let content = "";
  for await (const chunk of stream) {
    const delta =
      chunk?.choices?.[0]?.delta?.content || chunk?.choices?.[0]?.message?.content;
    if (delta) content += delta;
  }

  return content.trim();
}
