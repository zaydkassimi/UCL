interface Match {
  id: string
  homeTeam: { id: number; name: string; shortName: string }
  awayTeam: { id: number; name: string; shortName: string }
  time: string
  status: string
  utcDate: string
  stage: string
  score?: { home: number | null; away: number | null }
}

export const matches: Match[] = [
  // This file is being initialized with the requested Match interface fix.
];
