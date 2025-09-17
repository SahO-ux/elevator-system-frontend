import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

/**
 * MetricsPanel
 * - polls GET /api/metrics every `intervalMs`
 * - shows numeric metrics and a small svg sparkline for avgWait
 */
export default function MetricsPanel({ pollInterval = 2000 }) {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]); // keep last N avgWait samples
  const mounted = useRef(false);
  const MAX_HISTORY = 40;

  useEffect(() => {
    mounted.current = true;
    let timer = null;

    async function fetchMetrics() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/metrics`
        );
        if (!res.ok) {
          // ignore transient errors
          return;
        }
        const data = await res.json();
        if (!mounted.current) return;
        const sample = {
          ts: Date.now(),
          avgWait: data.avgWait || 0,
          maxWait: data.maxWait || 0,
          avgTravel: data.avgTravel || 0,
          maxTravel: data.maxTravel || 0,
          servedCount: data.servedCount || 0,
          utilization: data.utilization || 0,
          recentUtil: data.recentUtil || 0,
          throughputPerMin: data.throughputPerMin || 0,
          pendingCount: data.pendingCount || 0,
          maxPendingWait: data.maxPendingWait || 0,
        };
        setMetrics(sample);
        setHistory((h) => {
          const next = [...h, sample].slice(-MAX_HISTORY);
          return next;
        });
      } catch (e) {
        toast.error("Error fetching metrics: " + e.message);
      }
    }

    // initial fetch
    fetchMetrics();
    timer = setInterval(fetchMetrics, pollInterval);

    return () => {
      mounted.current = false;
      if (timer) clearInterval(timer);
    };
  }, [pollInterval]);

  // helper: convert ms -> seconds with 2 decimals
  const toSec = (ms) => (ms ? (ms / 1000).toFixed(2) : "0.00");

  // percent helper
  const toPct = (frac) =>
    typeof frac === "number" ? (frac * 100).toFixed(1) + "%" : "—";

  // build sparkline path from history avgWait
  function sparklinePath(w = 160, h = 40) {
    if (!history || history.length === 0) return "";
    const values = history.map((s) => s.avgWait || 0);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const step = w / Math.max(1, values.length - 1);
    return values
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Live Metrics</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Served</div>
          <div className="text-lg font-bold">
            {metrics ? metrics.servedCount : "—"}
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Avg Wait (s)</div>
          <div className="text-lg font-bold">
            {metrics ? toSec(metrics.avgWait) : "—"}
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Max Wait (s)</div>
          <div className="text-lg font-bold">
            {metrics ? toSec(metrics.maxWait) : "—"}
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Pending</div>
          <div className="text-lg font-bold">
            {metrics ? metrics.pendingCount : "—"}
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Avg Travel (s)</div>
          <div className="text-lg font-bold">
            {metrics ? toSec(metrics.avgTravel) : "—"}
          </div>
        </div>

        {/* <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Util (since start)</div>
          <div className="text-lg font-bold">
            {metrics ? toPct(metrics.utilization) : "—"}
          </div>
        </div> */}

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Util (last 60s)</div>
          <div className="text-lg font-bold">
            {metrics ? toPct(metrics.recentUtil) : "—"}
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Throughput (req/min)</div>
          <div className="text-lg font-bold">
            {metrics ? metrics.throughputPerMin.toFixed(2) : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <svg
          width={170}
          height={44}
          viewBox={`0 0 160 40`}
          className="bg-gray-50 rounded"
        >
          <path
            d={sparklinePath(160, 40)}
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-xs text-gray-500 mt-1">
          {history.length > 0
            ? `Last sample ${new Date(
                history[history.length - 1].ts
              ).toLocaleTimeString()}`
            : "No samples yet"}
        </div>
      </div>

      {/* <div className="mt-3 text-xs text-gray-500">
        {metrics ? `Max pending wait: ${toSec(metrics.maxPendingWait)} s` : ""}
      </div> */}
    </div>
  );
}
