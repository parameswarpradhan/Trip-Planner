import axios from "axios";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function geocodePlace({ placeName, destination }) {
  // Use destination to reduce wrong hits
  const q = `${placeName}, ${destination}`;

  const url = "https://nominatim.openstreetmap.org/search";
  const params = {
    q,
    format: "json",
    limit: 1,
  };

  // Nominatim rules: must send User-Agent (important)
  const headers = {
    "User-Agent": "tripwise-ai-travel-planner/1.0",
    "Accept-Language": "en",
  };

  try {
    // avoid hitting API too fast
    await sleep(350);

    const res = await axios.get(url, { params, headers });

    const first = res.data?.[0];
    if (!first) return null;

    return {
      lat: Number(first.lat),
      lng: Number(first.lon),
    };
  } catch (err) {
    return null;
  }
}
