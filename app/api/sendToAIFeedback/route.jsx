import { ExpertList } from "@/services/Options";
import { getOpenRouterModel, streamChatToText } from "@/lib/openrouter";
import { buildUsageEstimate } from "@/lib/usageMetrics";
import { getAppMetrics } from "@/lib/metrics";

export async function POST(req) {
  const metrics = getAppMetrics();
  const startedAt = Date.now();
  const method = "POST";
  const route = "/api/sendToAIFeedback";
  let status = "500";

  const {coachingOption, msg } = await req.json();

  if (!coachingOption || !msg) {
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
    const model = getOpenRouterModel();
    const systemPrompt = `You are an expert IELTS and Mock Interview examiner. 
    Analyze the following conversation and provide a structured assessment.
    
    CRITICAL: YOU MUST RETURN ONLY A VALID JSON OBJECT. NO OTHER TEXT.
    
    The JSON structure should be:
    {
      "scores": {
        "fluency": <1-10>,
        "vocabulary": <1-10>,
        "grammar": <1-10>
      },
      "pacing_advice": "string",
      "overall_feedback": "string",
      "best_response": "string",
      "suggested_improvements": ["string"]
    }

    The user is practicing: ${coachingOption}.
    ${option.summeryPrompt}`;
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: msg },
    ];

    const aiStartedAt = Date.now();
    const content = await streamChatToText({
      model,
      messages,
    });
    const usage = buildUsageEstimate({ model, messages, outputText: content });
    const aiStatus = "success";

    metrics.aiRequestsTotal.inc({ kind: "feedback", model, status: aiStatus });
    metrics.aiLatencyMs.observe({ kind: "feedback", model, status: aiStatus }, Date.now() - aiStartedAt);
    metrics.aiTokensTotal.inc({ kind: "feedback", model, direction: "input" }, usage.inputTokens);
    metrics.aiTokensTotal.inc({ kind: "feedback", model, direction: "output" }, usage.outputTokens);
    if (usage.estimatedCostUsd > 0) {
      metrics.aiEstimatedCostUsdTotal.inc({ kind: "feedback", model }, usage.estimatedCostUsd);
    }

    let cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Remove <think>...</think> blocks if the model (e.g. DeepSeek R1) outputs internal reasoning
    cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // Try to extract only the JSON object if there's surrounding text
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    let analysisData;
    try {
      analysisData = JSON.parse(cleanContent);
      // Validate schema loosely
      if (!analysisData.scores || typeof analysisData.scores.fluency === 'undefined') {
          throw new Error("Missing scores object");
      }
    } catch (parseErr) {
      console.error("Failed to parse AI output. Raw content:", content);
      console.warn("Falling back to default analysis template.");
      
      // Fallback object to prevent UI crash
      analysisData = {
          scores: { fluency: 5, vocabulary: 5, grammar: 5 },
          pacing_advice: "The conversation was too short or the AI encountered an error generating specific pacing advice.",
          overall_feedback: "Session completed, but insufficient data was gathered for a detailed evaluation. Try speaking more in the next session.",
          best_response: "N/A - System could not determine best response.",
          suggested_improvements: ["Engage in longer dialogue.", "Answer questions more fully."]
      };
    }

    status = "200";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(
      JSON.stringify({
        model,
        usage,
        analysis: analysisData,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("AI Analysis error:", err);
    const model = getOpenRouterModel();
    const aiStatus = "error";
    metrics.aiRequestsTotal.inc({ kind: "feedback", model, status: aiStatus });
    metrics.aiLatencyMs.observe({ kind: "feedback", model, status: aiStatus }, Date.now() - startedAt);
    status = "500";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
