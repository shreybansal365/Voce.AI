import { renderMetrics } from "@/lib/metrics";

export const runtime = "nodejs";

export async function GET(req) {
  const metricsToken = process.env.METRICS_BEARER_TOKEN;

  if (metricsToken) {
    const authHeader = req.headers.get("authorization");
    const expected = `Bearer ${metricsToken}`;

    if (authHeader !== expected) {
      return new Response("Unauthorized", {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  return new Response(renderMetrics(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
