import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";

// ✅ Day-wise colors (repeat after 7)
const DAY_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#14b8a6", "#eab308"];

function getDayColor(day) {
    const idx = (Number(day) - 1) % DAY_COLORS.length;
    return DAY_COLORS[idx];
}

// ✅ Create colored marker icons (using divIcon)
function getColoredIcon(color) {
    return L.divIcon({
        className: "",
        html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(0,0,0,0.35);
      "></div>
    `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
    });
}

function ClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick?.(e.latlng);
        },
    });
    return null;
}

// ✅ Sort places in a "rough itinerary" order using day and name
function sortPlaces(places) {
    return [...places].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return String(a.name).localeCompare(String(b.name));
    });
}

export default function TripMap({
    places = [],
    onAddPlace,
    selectedDay = "all",
    showRoute = true,
}) {
    const fallbackCenter = [20.5937, 78.9629];
    const first = places.find((p) => p.lat && p.lng);

    const center = first ? [Number(first.lat), Number(first.lng)] : fallbackCenter;

    // ✅ filtered + sorted places
    const mapPlaces = sortPlaces(places).filter((p) => p.lat && p.lng);

    // ✅ Build route coordinates
    const routeCoords = mapPlaces.map((p) => [Number(p.lat), Number(p.lng)]);

    return (
        <div style={{ height: "650px", width: "100%" }}>
            <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
                {/* Tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                />

                {/* ✅ click-to-add handler */}
                <ClickHandler onMapClick={onAddPlace} />

                {/* ✅ Route / Track */}
                {showRoute && routeCoords.length >= 2 && (
                    <Polyline
                        positions={routeCoords}
                        pathOptions={{
                            color: selectedDay === "all" ? "#ffffff" : getDayColor(Number(selectedDay)),
                            weight: 4,
                            opacity: 0.8,
                        }}
                    />
                )}

                {/* ✅ Markers */}
                {mapPlaces.map((p, i) => {
                    const color = getDayColor(p.day);
                    const icon = getColoredIcon(color);

                    return (
                        <Marker key={`${p.name}-${i}`} position={[Number(p.lat), Number(p.lng)]} icon={icon}>
                            <Popup>
                                <div style={{ fontSize: "14px", minWidth: "180px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                        <b>{p.name}</b>
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                padding: "2px 8px",
                                                borderRadius: "999px",
                                                background: color,
                                                color: "white",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Day {p.day}
                                        </span>
                                    </div>

                                    <div style={{ marginTop: "6px", color: "#444" }}>
                                        {p.category || "sightseeing"} • {p.source === "user" ? "Custom" : "AI"}
                                    </div>

                                    <div style={{ marginTop: "6px", fontSize: "12px", color: "#666" }}>
                                        {Number(p.lat).toFixed(4)}, {Number(p.lng).toFixed(4)}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
