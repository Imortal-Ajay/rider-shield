import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const LAT = 13.0827;
const LON = 80.2707;

const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

// Map OpenWeather AQI (1-5) to a numeric 0-500 scale for display
function mapAqiToNumeric(aqiLevel: number): number {
  const bands = [0, 50, 100, 150, 200, 300];
  return bands[aqiLevel] ?? 0;
}

export async function GET() {
  try {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      throw new Error(`OpenWeather AQI API error: ${res.status}`);
    }

    const data = await res.json();
    const list = data.list?.[0];

    if (!list) throw new Error('No AQI data returned');

    const aqiLevel: number = list.main.aqi; // 1–5
    const numericAqi: number = mapAqiToNumeric(aqiLevel);
    const category: string = AQI_LABELS[aqiLevel] ?? 'Unknown';
    const components = list.components;

    const riskFlags: string[] = [];
    if (numericAqi > 150) riskFlags.push('AQI');

    return NextResponse.json({
      aqi: numericAqi,
      aqiLevel,
      category,
      pm25: components?.pm2_5 ?? 0,
      pm10: components?.pm10 ?? 0,
      no2: components?.no2 ?? 0,
      o3: components?.o3 ?? 0,
      riskFlags,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/aqi]', message);
    return NextResponse.json(
      { error: 'Failed to fetch AQI data', detail: message },
      { status: 500 }
    );
  }
}
