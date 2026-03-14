import { NextResponse } from 'next/server';

const API_KEY = process.env.FOOTBALL_DATA_TOKEN;
const BASE_URL = 'https://api.football-data.org/v4';

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API token missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`${BASE_URL}/competitions/CL/matches?status=SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`, {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();

    const today = new Date().toISOString().split('T')[0];
    const todayMatches = data.matches.filter((m: any) => m.utcDate.startsWith(today));

    return NextResponse.json({ matches: todayMatches });
  } catch (error) {
    return NextResponse.json({ error: 'Data unavailable' }, { status: 502 });
  }
}
