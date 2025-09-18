import { useState, useEffect } from "react";

export default function Elevator({ elevator, floorCount = 12, onCmd }) {
  const perFloor = 48;
  const y = (elevator.currentFloor - 1) * perFloor;

  const [dest, setDest] = useState(elevator.currentFloor);
  useEffect(() => setDest(elevator.currentFloor), [elevator.currentFloor]);

  const floors = Array.from({ length: floorCount }).map((_, i) => i + 1);

  // capacity + status
  const capacity = elevator.capacity || 6;
  const count = elevator.passengerCount || 0;
  const nearThreshold = Math.floor(capacity * 0.8);
  const isFull = count >= capacity;
  const isNearFull = !isFull && count >= nearThreshold;

  // pulse animation when passenger count changes
  const [lastCount, setLastCount] = useState(count);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (count !== lastCount) {
      setPulse(true);
      setLastCount(count);
      const t = setTimeout(() => setPulse(false), 420);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <div className="relative" style={{ height: perFloor * floorCount }}>
      <div className="absolute left-0 bottom-0">
        <div
          className="w-32 h-20 border border-gray-700 bg-white shadow-md flex flex-col items-center justify-center transition-transform duration-500 ease-linear rounded-lg"
          style={{ transform: `translateY(${-y}px)` }}
        >
          {/* Header row with elevator ID + passenger badge */}
          <div className="flex items-center gap-2">
            <div className="font-bold text-sm">#{elevator.id}</div>

            {/* Passenger badge (always visible) */}
            {/* <div
              aria-label={`Passengers: ${count}`}
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                minWidth: 26,
                textAlign: "center",
                background: isFull
                  ? "#dc2626"
                  : isNearFull
                  ? "#facc15"
                  : "#bfdbfe",
                color: isFull ? "#fff" : isNearFull ? "#000" : "#1e3a8a",
                boxShadow: pulse ? "0 0 0 6px rgba(99,102,241,0.12)" : "none",
                transform: pulse ? "scale(1.08)" : "scale(1)",
                transition: "transform 220ms ease, box-shadow 300ms ease",
              }}
            >
              {count}
            </div> */}
            
            <div className="flex items-center gap-1">
              <div
                aria-label={`Passengers: ${count}`}
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  minWidth: 26,
                  textAlign: "center",
                  background: isFull
                    ? "#dc2626"
                    : isNearFull
                    ? "#facc15"
                    : "#bfdbfe",
                  color: isFull ? "#fff" : isNearFull ? "#000" : "#1e3a8a",
                  boxShadow: pulse ? "0 0 0 6px rgba(99,102,241,0.12)" : "none",
                  transform: pulse ? "scale(1.08)" : "scale(1)",
                  transition: "transform 220ms ease, box-shadow 300ms ease",
                }}
              >
                {count}
              </div>
              {count > 0 ? (
                <span className="text-[10px] text-gray-600">{`passenger${
                  count > 1 ? "s" : ""
                }`}</span>
              ) : (
                <></>
              )}
            </div>

            {/* Optional extra FULL/NEAR badge */}
            {isFull ? (
              <div className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">
                FULL
              </div>
            ) : isNearFull ? (
              <div className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded">
                NEAR
              </div>
            ) : null}
          </div>

          {/* Status text */}
          <div className="text-[11px] text-gray-600 mt-1">
            {elevator.direction} • {elevator.doorState}
          </div>
          <div className="text-xs mt-1">Floor {elevator.currentFloor}</div>

          {/* Controls */}
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
                // send internal request specifying elevatorId
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

          {/* Target floors */}
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
