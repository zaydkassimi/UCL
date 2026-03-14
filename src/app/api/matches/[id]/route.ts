import { NextResponse } from 'next/server';

const API_KEY = process.env.FOOTBALL_DATA_TOKEN;
const BASE_URL = 'https://api.football-data.org/v4';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API token missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`${BASE_URL}/matches/${id}`, {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Data unavailable' }, { status: 502 });
  }
}
