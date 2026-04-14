import axios from "axios";
import { getAppMetrics } from "@/lib/metrics";

export async function POST(req) {
  const metrics = getAppMetrics();
  const startedAt = Date.now();
  const method = "POST";
  const route = "/api/speech";
  let status = "500";

  try {
    const { text } = await req.json();
    if (!text) {
      status = "400";
      metrics.httpRequestsTotal.inc({ route, method, status });
      metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
      return new Response("No text provided", { status: 400 });
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";

    if (!elevenLabsApiKey) {
      status = "500";
      metrics.httpRequestsTotal.inc({ route, method, status });
      metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
      return new Response("ELEVENLABS_API_KEY is not set", { status: 500 });
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      { text },
      {
        headers: {
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // important to get audio bytes
      }
    );

    // Return audio file as response
    status = "200";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response(response.data, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    status = "500";
    metrics.httpRequestsTotal.inc({ route, method, status });
    metrics.httpRequestDurationMs.observe({ route, method, status }, Date.now() - startedAt);
    return new Response("Failed to generate speech", { status: 500 });
  }
}
