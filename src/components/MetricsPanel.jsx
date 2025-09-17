import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

export default function MetricsPanel({ pollInterval = 2000 }) {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
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
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted.current) return;
        const sample = {
          ts: Date.now(),
          avgWait: data.avgWait || 0,
          avgTravel: data.avgTravel || 0,
          servedCount: data.servedCount || 0,
          utilization: data.utilization || 0,
        };
        setMetrics(sample);
        setHistory((h) => [...h, sample].slice(-MAX_HISTORY));
      } catch (e) {
        toast.error("Error fetching metrics: " + e.message);
      }
    }

    fetchMetrics();
    timer = setInterval(fetchMetrics, pollInterval);

    return () => {
      mounted.current = false;
      if (timer) clearInterval(timer);
    };
  }, [pollInterval]);

  const toSec = (ms) => (ms ? (ms / 1000).toFixed(2) : "0.00");

  function sparklinePath(w = 160, h = 40) {
    if (!history.length) return "";
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
          <div className="text-xs text-gray-500">Avg Travel (s)</div>
          <div className="text-lg font-bold">
            {metrics ? toSec(metrics.avgTravel) : "—"}
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-2">
          <div className="text-xs text-gray-500">Utilization</div>
          <div className="text-lg font-bold">
            {metrics ? (metrics.utilization * 100).toFixed(1) + "%" : "—"}
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
    </div>
  );
}
