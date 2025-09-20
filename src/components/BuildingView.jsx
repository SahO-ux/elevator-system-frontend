import toast from "react-hot-toast";

import Elevator from "./Elevator.jsx";
import InlineSpinner from "./InlineSpinner.jsx";

export default function BuildingView({ snapshot, onCmd }) {
  if (!snapshot) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        <InlineSpinner />
        Establishing Socket Connection, please wait...
      </div>
    );
  }

  // Single source of truth for floor pixel height
  const perFloor = 56; // px per floor (must match grid row height below)
  const floorCount =
    snapshot.elevators && snapshot.elevators.length
      ? snapshot.elevators[0].buildingFloors || 12
      : 12;

  // floors top -> bottom for the left column
  const floors = Array.from({ length: floorCount }).map(
    (_, i) => floorCount - i
  );

  // shaft width (one column per elevator)
  const shaftWidth = 140;

  return (
    <div className="flex gap-6">
      {/* Floor call buttons column */}
      <div
        className="bg-transparent"
        style={{
          gridTemplateRows: `repeat(${floorCount}, ${perFloor}px)`,
          display: "grid",
        }}
      >
        {floors.map((floor) => (
          <div
            key={floor}
            className="flex items-center justify-between border-b border-gray-200 bg-white px-3 text-sm"
            style={{ height: perFloor }}
          >
            <div className="font-medium text-gray-700">Floor {floor}</div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const dest = parseInt(
                    prompt(
                      `Call elevator from floor ${floor} — enter destination floor (1-${floorCount})`,
                      Math.min(floor + 1, floorCount)
                    ),
                    10
                  );
                  if (!dest) return;
                  if (dest < 1 || dest > floorCount)
                    return toast.error(
                      `Destination floor must be between 1 and ${floorCount}.`
                    );
                  if (dest === floor)
                    return toast.error(
                      "Destination floor must be different from origin floor."
                    );
                  onCmd("manualRequest", {
                    payload: {
                      type: "external",
                      origin: floor,
                      destination: dest,
                    },
                  });
                }}
                // disabled={floor === floorCount}
                className="px-2 py-0.5 border rounded text-xs bg-blue-100 hover:bg-blue-200 disabled:opacity-40"
              >
                ↕️
              </button>
              {/* <button
                onClick={() => {
                  const dest = parseInt(
                    prompt(
                      `Call elevator from floor ${floor} — enter destination floor (1-${floorCount})`,
                      Math.max(floor - 1, 1)
                    ),
                    10
                  );
                  if (!dest || dest < 1 || dest > floorCount) return;
                  onCmd("manualRequest", {
                    payload: {
                      type: "external",
                      origin: floor,
                      destination: dest,
                    },
                  });
                }}
                disabled={floor === 1}
                className="px-2 py-0.5 border rounded text-xs bg-blue-100 hover:bg-blue-200 disabled:opacity-40"
              >
                ↓
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {/* Elevator shafts (one shaft per elevator) */}
      <div className="flex items-end gap-6" style={{ alignItems: "flex-end" }}>
        {snapshot.elevators.map((e, idx) => (
          <div
            key={e.id}
            style={{
              width: shaftWidth,
              height: perFloor * floorCount + "px",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Elevator
              elevator={e}
              floorCount={floorCount}
              perFloor={perFloor}
              shaftWidth={shaftWidth}
              onCmd={onCmd}
              shaftIndex={idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
