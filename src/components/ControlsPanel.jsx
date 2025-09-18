import { useState } from "react";
import toast from "react-hot-toast";

export default function ControlsPanel({ snapshot, onCmd }) {
  const [speed, setSpeed] = useState(1);
  const [origin, setOrigin] = useState(1);
  const [destination, setDestination] = useState(2);

  // new config fields
  const [nElevators, setNElevators] = useState(3);
  const [nFloors, setNFloors] = useState(12);

  // TBD
  // const [requestFreq, setRequestFreq] = useState(0); // requests per minute (UI only for now)

  const floorCount = snapshot?.elevators?.length
    ? snapshot.elevators?.[0]?.buildingFloors || 12
    : 12;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            onCmd("start");
          }}
          className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Start
        </button>
        <button
          onClick={() => onCmd("stop")}
          className="px-3 py-1 border rounded bg-red-500 text-white hover:bg-red-600"
        >
          Stop
        </button>
        <button
          onClick={() => {
            onCmd("reset");
            setSpeed(1);
          }}
          className="px-3 py-1 border rounded bg-gray-500 text-white hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <div>
        <label className="mr-2 text-sm">Simulation Speed:</label>
        <select
          value={speed}
          onChange={(e) => {
            const s = Number(e.target.value);
            setSpeed(s);
            onCmd("speed", { speed: s });
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
        </select>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-1">Manual Request</h4>
        <div className="flex items-center gap-2">
          <label className="text-sm">From</label>
          <input
            type="number"
            value={origin}
            min="1"
            onChange={(e) => setOrigin(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1 text-sm"
          />
          <label className="text-sm">To</label>
          <input
            type="number"
            value={destination}
            min="1"
            max={floorCount}
            onChange={(e) => setDestination(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => {
              if (origin === destination)
                return toast.error(
                  "Origin and destination cannot be the same."
                );
              else if (origin < 1 || origin > floorCount)
                return toast.error(
                  `Origin must be between 1 and ${floorCount}.`
                );
              else if (destination < 1 || destination > floorCount)
                return toast.error(
                  `Destination must be between 1 and ${floorCount}.`
                );
              onCmd("manualRequest", {
                payload: { type: "external", origin, destination },
              });
            }}
            className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>

      {/* NEW: Configuration section */}
      <div className="border-t pt-3 space-y-2">
        <h4 className="font-semibold text-gray-700">Simulation Config</h4>

        <div className="flex items-center gap-2">
          <label className="w-28 text-sm">Elevators</label>
          <input
            type="number"
            min="1"
            value={nElevators}
            onChange={(e) => setNElevators(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-28 text-sm">Floors</label>
          <input
            type="number"
            min="2"
            value={nFloors}
            onChange={(e) => setNFloors(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* <div className="flex items-center gap-2">
          <label className="w-28 text-sm">Req / min</label>
          <input
            type="range"
            min="0"
            max="120"
            value={requestFreq}
            onChange={(e) => setRequestFreq(Number(e.target.value))}
            className="w-full"
          />
          <div className="w-14 text-right text-sm">{requestFreq}</div>
        </div> */}

        <div className="flex gap-2">
          <button
            onClick={() =>
              onCmd("reconfig", {
                config: {
                  nElevators: nElevators,
                  nFloors: nFloors,
                  // ...(requestFreq > 0 ? { requestFreq } : {}),
                },
              })
            }
            className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Apply Config
          </button>

          {/* <button
            onClick={() => {
              setNElevators(3);
              setNFloors(12);
              setRequestFreq(0);
            }}
            className="px-3 py-1 border rounded bg-gray-100"
          >
            Reset Config
          </button> */}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onCmd("scenario", { name: "morningRush" })}
          className="px-3 py-1 border rounded bg-green-500 text-white hover:bg-green-600"
        >
          Morning Rush
        </button>
        <button
          onClick={() => onCmd("scenario", { name: "randomBurst" })}
          className="px-3 py-1 border rounded bg-green-500 text-white hover:bg-green-600"
        >
          Random Burst
        </button>
      </div>
    </div>
  );
}
