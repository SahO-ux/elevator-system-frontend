import { useState, useEffect } from "react";

export default function Elevator({ elevator, floorCount = 12, onCmd }) {
  const perFloor = 48;
  const y = (elevator.currentFloor - 1) * perFloor;

  const [dest, setDest] = useState(elevator.currentFloor);
  useEffect(() => setDest(elevator.currentFloor), [elevator.currentFloor]);

  const floors = Array.from({ length: floorCount }).map((_, i) => i + 1);

  return (
    <div className="relative" style={{ height: perFloor * floorCount }}>
      <div className="absolute left-0 bottom-0">
        <div
          className="w-28 h-14 border border-gray-700 bg-white shadow-sm flex flex-col items-center justify-center transition-transform duration-500 ease-linear rounded"
          style={{ transform: `translateY(${-y}px)` }}
        >
          <div className="font-bold text-sm">
            #{elevator.id}{" "}
            {elevator.passengerCount > 0 ? `• ${elevator.passengerCount}` : ""}
          </div>
          <div className="text-[11px] text-gray-600">
            {elevator.direction} • {elevator.doorState}
          </div>
          <div className="text-xs mt-1">Floor {elevator.currentFloor}</div>

          <div className="flex gap-2 mt-2">
            <select
              value={dest}
              onChange={(e) => setDest(Number(e.target.value))}
              className="text-xs border rounded px-1 py-0.5"
            >
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!onCmd) return;
                if (dest === elevator.currentFloor) return;
                onCmd("manualRequest", {
                  payload: {
                    type: "internal",
                    origin: elevator.currentFloor,
                    destination: dest,
                    elevatorId: elevator.id,
                  },
                });
              }}
              className="px-2 py-0.5 text-xs border rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Send
            </button>
          </div>

          <div className="text-[10px] text-gray-500 mt-1">
            Targets:{" "}
            {elevator.targetFloors && elevator.targetFloors.length
              ? elevator.targetFloors.join(", ")
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
