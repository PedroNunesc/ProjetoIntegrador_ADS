interface GeoResponse {
  lat: number;
  lon: number;
}

interface MeteostatDaily {
  tmin: number;
  tmax: number;
}

interface MeteostatResponse {
  data?: MeteostatDaily[];
}

interface HistoricalAverageResult {
  temp_min_avg: number | null;
  temp_max_avg: number | null;
  temp_avg: number | null;
  status: "ok" | "no_data";
}

const historicalCache: Record<string, MeteostatDaily[]> = {};

async function getCityCoordinates(city: string, country: string): Promise<GeoResponse | null> {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${OPENWEATHER_API_KEY}`;

  try {
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error(`Erro na geolocalização: ${geoRes.status}`);

    const geoData = (await geoRes.json()) as Array<{ lat: number; lon: number }>;
    if (!geoData[0]) return null;

    return { lat: geoData[0].lat, lon: geoData[0].lon };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

async function getHistoricalAverageForDay(lat: number, lon: number, month: number, day: number) {
  const cacheKey = `${lat}_${lon}_${month}_${day}`;
  if (historicalCache[cacheKey]) {
    const temps = historicalCache[cacheKey];
    const avgMin = temps.reduce((a, b) => a + b.tmin, 0) / temps.length;
    const avgMax = temps.reduce((a, b) => a + b.tmax, 0) / temps.length;
    return { temp_min_avg: avgMin, temp_max_avg: avgMax, temp_avg: (avgMin + avgMax) / 2 };
  }

  const startYear = 2023;
  const endYear = 2025;
  const temps: MeteostatDaily[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const url = `https://meteostat.p.rapidapi.com/point/daily?lat=${lat}&lon=${lon}&start=${dateStr}&end=${dateStr}&units=metric`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'meteostat.p.rapidapi.com',
          'x-rapidapi-key': METEOSTAT_API_KEY,
        },
      });
      if (!res.ok) continue;

      const data = (await res.json()) as MeteostatResponse;
      if (data.data && data.data.length > 0) {
        const { tmin, tmax } = data.data[0];
        if (typeof tmin === 'number' && typeof tmax === 'number') {
          temps.push({ tmin, tmax });
        }
      }
    } catch (err) {
      console.error(`Erro na API Meteostat para ${dateStr}:`, err);
      continue;
    }
  }

  if (!temps.length) return null;
  historicalCache[cacheKey] = temps;

  const avgMin = temps.reduce((a, b) => a + b.tmin, 0) / temps.length;
  const avgMax = temps.reduce((a, b) => a + b.tmax, 0) / temps.length;
  return { temp_min_avg: avgMin, temp_max_avg: avgMax, temp_avg: (avgMin + avgMax) / 2 };
}

export async function getHistoricalAverageForInterval(
  city: string,
  country: string,
  startDateStr: string,
  endDateStr: string
) {
  const coords = await getCityCoordinates(city, country);
  if (!coords) return null;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const dates = getDatesBetween(startDate, endDate);

  const MAX_CONCURRENT = 5;
  const results: HistoricalAverageResult[] = [];

  for (let i = 0; i < dates.length; i += MAX_CONCURRENT) {
    const batch = dates.slice(i, i + MAX_CONCURRENT);

    const batchResults = await Promise.all(
      batch.map(async (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const avg = await getHistoricalAverageForDay(coords.lat, coords.lon, month, day);
        const status: "ok" | "no_data" = avg ? "ok" : "no_data";

        return {
          temp_min_avg: avg?.temp_min_avg ?? null,
          temp_max_avg: avg?.temp_max_avg ?? null,
          temp_avg: avg?.temp_avg ?? null,
          status,
        };
      })
    );

    results.push(...batchResults);
  }

  const validDays = results.filter((r) => r.status === "ok");
  if (validDays.length === 0) return null;

  const tempMinAvg =
    validDays.reduce((sum, d) => sum + (d.temp_min_avg ?? 0), 0) / validDays.length;
  const tempMaxAvg =
    validDays.reduce((sum, d) => sum + (d.temp_max_avg ?? 0), 0) / validDays.length;
  const tempAvg = validDays.reduce((sum, d) => sum + (d.temp_avg ?? 0), 0) / validDays.length;

  return { temp_avg: tempAvg };

}
