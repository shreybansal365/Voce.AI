import { ExpertList } from "@/services/Options";
import { getOpenRouterModel, streamChatToText } from "@/lib/openrouter";
import { buildUsageEstimate } from "@/lib/usageMetrics";
import { getAppMetrics } from "@/lib/metrics";

export async function POST(req) {
  const metrics = getAppMetrics();
  const startedAt = Date.now();
  const method = "POST";
  const route = "/api/sendToAI";
  let status = "500";

  const { topic, coachingOption, msg } = await req.json();

  if (!topic || !coachingOption || !msg) {
    status = "400";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
  }

  const option = ExpertList.find(item => item.name === coachingOption);
  if (!option) {
    status = "400";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(JSON.stringify({ error: "Invalid coaching option" }), { status: 400 });
  }

  try {
    const PROMPT = option.prompt.replace("{user_topic}", topic);
    const model = getOpenRouterModel();
    const messages = [
      { role: "assistant", content: PROMPT },
      { role: "user", content: msg },
    ];
    console.log("INITIALIZING AI REQUEST:", { model, topic, msgLength: msg.length });
    
    const aiStartedAt = Date.now();
    const content = await streamChatToText({
      model,
      messages,
    });
    const usage = buildUsageEstimate({ model, messages, outputText: content });
    const aiStatus = "success";

    metrics.aiRequestsTotal.inc({ kind: "chat", model, status: aiStatus });
    metrics.aiLatencyMs.observe({ kind: "chat", model, status: aiStatus }, Date.now() - aiStartedAt);
    metrics.aiTokensTotal.inc({ kind: "chat", model, direction: "input" }, usage.inputTokens);
    metrics.aiTokensTotal.inc({ kind: "chat", model, direction: "output" }, usage.outputTokens);
    if (usage.estimatedCostUsd > 0) {
      metrics.aiEstimatedCostUsdTotal.inc({ kind: "chat", model }, usage.estimatedCostUsd);
    }

    console.log("AI RESPONSE SUCCESSFUL:", { contentPreview: content.substring(0, 50) });
    status = "200";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);

    return new Response(
      JSON.stringify({
        model,
        usage,
        choices: [{ message: { content } }],
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("CRITICAL AI FAILURE:", {
        message: err.message,
        stack: err.stack,
        details: err.response?.data || "No extra details"
    });
    const model = getOpenRouterModel();
    const aiStatus = "error";
    metrics.aiRequestsTotal.inc({ kind: "chat", model, status: aiStatus });
    metrics.aiLatencyMs.observe({ kind: "chat", model, status: aiStatus }, Date.now() - startedAt);
    status = "500";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(JSON.stringify({ error: err.message, detailed: err.response?.data }), { status: 500 });
  }
}
