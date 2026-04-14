import axios from "axios";
import { getAppMetrics } from "@/lib/metrics";

export async function POST(req) {
  const metrics = getAppMetrics();
  const startedAt = Date.now();
  const method = "POST";
  const route = "/api/transcribe";
  let status = "500";

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      status = "400";
      metrics.httpRequestsTotal.inc({ route, method, status });
      metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
      return new Response(JSON.stringify({ error: "No audio file provided" }), { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      status = "500";
      metrics.httpRequestsTotal.inc({ route, method, status });
      metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured" }), { status: 500 });
    }

    // Groq requires a file with a known name/extension to process correctly
    const openAiFormData = new FormData();
    openAiFormData.append("file", file, "audio.webm");
    // Request verbose_json to get segment-level timestamps and metadata
    openAiFormData.append("model", "whisper-large-v3");
    openAiFormData.append("response_format", "verbose_json");

    // Send the chunked audio to Groq Whisper for instantaneous processing
    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      openAiFormData,
      {
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
        },
      }
    );

    status = "200";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Transcription error:", err?.response?.data || err.message);
    status = "500";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(JSON.stringify({ error: "Transcription failed" }), { status: 500 });
  }
}
