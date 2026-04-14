const DEFAULT_INPUT_COST_PER_MILLION = Number.parseFloat(
  process.env.OPENROUTER_INPUT_COST_PER_MILLION || "0"
);
const DEFAULT_OUTPUT_COST_PER_MILLION = Number.parseFloat(
  process.env.OPENROUTER_OUTPUT_COST_PER_MILLION || "0"
);

function estimateTokensFromText(value) {
  if (!value) return 0;
  return Math.max(1, Math.ceil(String(value).trim().length / 4));
}

export function buildUsageEstimate({ model, messages = [], outputText = "" }) {
  const inputTokens = messages.reduce((total, message) => {
    return total + estimateTokensFromText(message?.content);
  }, 0);
  const outputTokens = estimateTokensFromText(outputText);
  const totalTokens = inputTokens + outputTokens;

  const estimatedCostUsd =
    (inputTokens / 1_000_000) * DEFAULT_INPUT_COST_PER_MILLION +
    (outputTokens / 1_000_000) * DEFAULT_OUTPUT_COST_PER_MILLION;

  return {
    model,
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
  };
}
