import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import ControlsPanel from "./components/ControlsPanel.jsx";
import BuildingView from "./components/BuildingView.jsx";
import MetricsPanel from "./components/MetricsPanel.jsx";

const WS_URL =
  window.location.hostname === "localhost"
    ? "ws://localhost:8081/ws"
    : `wss://${window.location.host}/ws`;

export default function App() {
  const [snapshot, setSnapshot] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.addEventListener("open", () => console.log("WS connected"));
    ws.addEventListener("message", (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "snapshot") setSnapshot(msg.data);
        if (msg.type === "error")
          return toast.error(msg.message || "Server error");
        if (msg.type === "info") return toast.success(msg.message || "Info");
        if (msg.type === "simStop") {
          setSnapshot((prev) => {
            return {
              ...prev,
              running: false,
            };
          });
          return toast.success(msg.message || "Info");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error in socket response: " + err.message);
      }
    });
    ws.addEventListener("close", () => console.log("WS closed"));
    ws.addEventListener("error", (e) => console.error("WS error", e));

    return () => {
      ws.close();
    };
  }, []);

  const sendCmd = (cmd, payload = {}) => {
    if (!wsRef.current || wsRef.current.readyState !== 1) return;
    wsRef.current.send(JSON.stringify({ cmd, ...payload }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Simulation status bar */}
      {snapshot?.running ? (
        <div className="bg-green-100 text-green-800 text-sm text-center py-2 shadow">
          Simulation is active...
        </div>
      ) : (
        <div className="bg-gray-200 text-gray-600 text-sm text-center py-2 shadow">
          Simulation is inactive. Click "Start" to begin.
        </div>
      )}

      {/* Main layout */}
      <div className="flex gap-6 p-6 flex-1">
        <div className="w-80 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Controls</h2>
          <ControlsPanel snapshot={snapshot} onCmd={sendCmd} />
          <MetricsPanel pollInterval={2000} />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Building View
          </h2>
          <BuildingView snapshot={snapshot} onCmd={sendCmd} />
        </div>
      </div>
    </div>
  );
}
