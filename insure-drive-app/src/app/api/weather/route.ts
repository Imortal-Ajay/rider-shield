import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const LAT = 13.0827; // Chennai
const LON = 80.2707;

export async function GET() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      throw new Error(`OpenWeather API error: ${res.status}`);
    }

    const data = await res.json();

    const temp: number = Math.round(data.main.temp);
    const feelsLike: number = Math.round(data.main.feels_like);
    const humidity: number = data.main.humidity;
    const rain: number = data.rain?.['1h'] ?? 0;
    const description: string = data.weather?.[0]?.description ?? 'clear';
    const icon: string = data.weather?.[0]?.icon ?? '01d';
    const windSpeed: number = Math.round(data.wind?.speed ?? 0);

    // Determine risk status
    const riskFlags: string[] = [];
    if (rain > 20) riskFlags.push('RAIN');
    if (temp > 40) riskFlags.push('HEAT');

    return NextResponse.json({
      temp,
      feelsLike,
      humidity,
      rain,
      description,
      icon,
      windSpeed,
      riskFlags,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/weather]', message);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', detail: message },
      { status: 500 }
    );
  }
}
