import "server-only";

function stableLabelKey(labels) {
  if (!labels) return "";
  const keys = Object.keys(labels).sort();
  return keys.map((k) => `${k}=${String(labels[k])}`).join(",");
}

function formatLabels(labels) {
  if (!labels) return "";
  const keys = Object.keys(labels).sort();
  if (keys.length === 0) return "";
  const parts = keys.map((k) => `${k}="${String(labels[k]).replaceAll('"', '\\"')}"`);
  return `{${parts.join(",")}}`;
}

function createCounter({ name, help, labelNames = [] }) {
  const values = new Map(); // key -> number
  return {
    name,
    help,
    type: "counter",
    labelNames,
    inc(labels, value = 1) {
      const key = stableLabelKey(labels);
      values.set(key, (values.get(key) || 0) + value);
    },
    lines() {
      const out = [];
      for (const [key, val] of values.entries()) {
        const labels = key
          ? Object.fromEntries(key.split(",").map((pair) => pair.split("=")))
          : null;
        out.push(`${name}${formatLabels(labels)} ${val}`);
      }
      if (out.length === 0) out.push(`${name} 0`);
      return out;
    },
  };
}

function createGauge({ name, help, labelNames = [] }) {
  const values = new Map();
  return {
    name,
    help,
    type: "gauge",
    labelNames,
    set(labels, value) {
      const key = stableLabelKey(labels);
      values.set(key, value);
    },
    lines() {
      const out = [];
      for (const [key, val] of values.entries()) {
        const labels = key
          ? Object.fromEntries(key.split(",").map((pair) => pair.split("=")))
          : null;
        out.push(`${name}${formatLabels(labels)} ${val}`);
      }
      if (out.length === 0) out.push(`${name} 0`);
      return out;
    },
  };
}

function createHistogram({ name, help, labelNames = [], buckets = [] }) {
  const sortedBuckets = [...buckets].sort((a, b) => a - b);
  const series = new Map(); // key -> { bucketCounts: number[], sum: number, count: number }

  function getSeries(labels) {
    const key = stableLabelKey(labels);
    if (!series.has(key)) {
      series.set(key, {
        bucketCounts: sortedBuckets.map(() => 0),
        sum: 0,
        count: 0,
      });
    }
    return { key, data: series.get(key) };
  }

  return {
    name,
    help,
    type: "histogram",
    labelNames,
    buckets: sortedBuckets,
    observe(labels, value) {
      const { data } = getSeries(labels);
      data.sum += value;
      data.count += 1;
      for (let i = 0; i < sortedBuckets.length; i++) {
        if (value <= sortedBuckets[i]) data.bucketCounts[i] += 1;
      }
    },
    lines() {
      const out = [];
      for (const [key, data] of series.entries()) {
        const baseLabels = key
          ? Object.fromEntries(key.split(",").map((pair) => pair.split("=")))
          : {};
        for (let i = 0; i < sortedBuckets.length; i++) {
          out.push(
            `${name}_bucket${formatLabels({ ...baseLabels, le: sortedBuckets[i] })} ${data.bucketCounts[i]}`
          );
        }
        out.push(`${name}_bucket${formatLabels({ ...baseLabels, le: "+Inf" })} ${data.count}`);
        out.push(`${name}_sum${formatLabels(baseLabels)} ${data.sum}`);
        out.push(`${name}_count${formatLabels(baseLabels)} ${data.count}`);
      }
      if (out.length === 0) {
        out.push(`${name}_bucket{le="+Inf"} 0`);
        out.push(`${name}_sum 0`);
        out.push(`${name}_count 0`);
      }
      return out;
    },
  };
}

const registry = (() => {
  const metrics = {};

  metrics.httpRequestsTotal = createCounter({
    name: "voce_http_requests_total",
    help: "Total HTTP requests served by Next.js API routes",
    labelNames: ["route", "method", "status"],
  });

  metrics.httpRequestDurationMs = createHistogram({
    name: "voce_http_request_duration_ms",
    help: "HTTP request duration for Next.js API routes (ms)",
    labelNames: ["route", "method", "status"],
    buckets: [25, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
  });

  metrics.aiRequestsTotal = createCounter({
    name: "voce_ai_requests_total",
    help: "Total AI requests made (OpenRouter + external speech/transcribe)",
    labelNames: ["kind", "model", "status"],
  });

  metrics.aiLatencyMs = createHistogram({
    name: "voce_ai_latency_ms",
    help: "AI request end-to-end latency (ms)",
    labelNames: ["kind", "model", "status"],
    buckets: [100, 250, 500, 1000, 2000, 5000, 10000, 20000, 60000],
  });

  metrics.aiTokensTotal = createCounter({
    name: "voce_ai_tokens_total",
    help: "Estimated AI tokens consumed",
    labelNames: ["kind", "model", "direction"],
  });

  metrics.aiEstimatedCostUsdTotal = createCounter({
    name: "voce_ai_estimated_cost_usd_total",
    help: "Estimated AI cost in USD",
    labelNames: ["kind", "model"],
  });

  metrics.processHeapBytes = createGauge({
    name: "voce_process_heap_bytes",
    help: "Node.js heap used (bytes)",
  });
  metrics.processResidentMemoryBytes = createGauge({
    name: "voce_process_resident_memory_bytes",
    help: "Node.js RSS (bytes)",
  });
  metrics.processUptimeSeconds = createGauge({
    name: "voce_process_uptime_seconds",
    help: "Process uptime (seconds)",
  });

  function render() {
    const mem = process.memoryUsage();
    metrics.processHeapBytes.set(null, mem.heapUsed);
    metrics.processResidentMemoryBytes.set(null, mem.rss);
    metrics.processUptimeSeconds.set(null, Math.floor(process.uptime()));

    const lines = [];
    for (const metric of Object.values(metrics)) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);
      lines.push(...metric.lines());
    }
    return lines.join("\n") + "\n";
  }

  return { metrics, render };
})();

export function getAppMetrics() {
  return registry.metrics;
}

export function renderMetrics() {
  return registry.render();
}
