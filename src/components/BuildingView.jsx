import Elevator from "./Elevator.jsx";

export default function BuildingView({ snapshot, onCmd }) {
  if (!snapshot) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        Waiting for simulation...
      </div>
    );
  }

  const floorCount =
    snapshot.elevators && snapshot.elevators.length
      ? snapshot.elevators[0].buildingFloors || 12
      : 12;
  const floors = Array.from({ length: floorCount }).map(
    (_, i) => floorCount - i
  );

  return (
    <div className="flex gap-6">
      {/* Floor call buttons */}
      <div
        className={`grid`}
        style={{ gridTemplateRows: `repeat(${floorCount}, 56px)` }}
      >
        {floors.map((floor) => (
          <div
            key={floor}
            className="flex items-center justify-between border-b border-gray-200 bg-white px-3 text-sm"
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
                  if (!dest || dest < 1 || dest > floorCount) return;
                  onCmd("manualRequest", {
                    payload: {
                      type: "external",
                      origin: floor,
                      destination: dest,
                    },
                  });
                }}
                disabled={floor === floorCount}
                className="px-2 py-0.5 border rounded text-xs bg-blue-100 hover:bg-blue-200 disabled:opacity-40"
              >
                ↑
              </button>
              <button
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
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Elevators */}
      <div className="flex items-end gap-4">
        {snapshot.elevators.map((e) => (
          <Elevator
            key={e.id}
            elevator={e}
            floorCount={floorCount}
            onCmd={onCmd}
          />
        ))}
      </div>
    </div>
  );
}
