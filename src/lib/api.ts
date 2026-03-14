export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  time: string;
  status: 'LIVE' | 'UPCOMING' | 'FT';
  utcDate: string;
  stage: string;
  group?: string;
}

export interface Standing {
  group: string;
  table: {
    position: number;
    team: Team;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }[];
}

const formatStage = (stage: string): string => {
  const stages: Record<string, string> = {
    'FINAL': 'Final',
    'SEMI_FINALS': 'Semi Finals',
    'QUARTER_FINALS': 'Quarter Finals',
    'LAST_16': 'Round of 16',
    'LEAGUE_STAGE': 'League Phase',
    'LEAGUE_PHASE': 'League Phase',
    'GROUP_STAGE': 'Group Stage',
    'PRELIMINARY_ROUND': 'Preliminary Round',
  };
  return stages[stage] || stage.replace(/_/g, ' ');
};

const mapApiStatus = (status: string): 'LIVE' | 'UPCOMING' | 'FT' => {
  if (['IN_PLAY', 'PAUSED'].includes(status)) return 'LIVE';
  if (['FINISHED'].includes(status)) return 'FT';
  return 'UPCOMING';
};

const mapApiMatch = (m: any): Match => ({
  id: m.id.toString(),
  homeTeam: {
    id: m.homeTeam.id,
    name: m.homeTeam.name,
    shortName: m.homeTeam.shortName || m.homeTeam.tla,
    crest: m.homeTeam.crest,
  },
  awayTeam: {
    id: m.awayTeam.id,
    name: m.awayTeam.name,
    shortName: m.awayTeam.shortName || m.awayTeam.tla,
    crest: m.awayTeam.crest,
  },
  homeScore: m.score.fullTime.home ?? m.score.halfTime.home ?? undefined,
  awayScore: m.score.fullTime.away ?? m.score.halfTime.away ?? undefined,
  time: new Date(m.utcDate).toLocaleTimeString('en-GB', { 
    timeZone: 'Africa/Casablanca', 
    hour: '2-digit', 
    minute: '2-digit' 
  }),
  status: mapApiStatus(m.status),
  utcDate: m.utcDate,
  stage: formatStage(m.stage),
  group: m.group,
});

export const getTodayMatches = async (): Promise<Match[]> => {
  const res = await fetch('/api/matches/today');
  if (!res.ok) throw new Error('Data unavailable');
  const data = await res.json();
  return data.matches.map(mapApiMatch);
};

export const getLiveMatches = async (): Promise<Match[]> => {
  const res = await fetch('/api/matches/live');
  if (!res.ok) throw new Error('Data unavailable');
  const data = await res.json();
  return data.matches.map(mapApiMatch);
};

export const getAllMatches = async (): Promise<Match[]> => {
  const res = await fetch('/api/matches/all');
  if (!res.ok) throw new Error('Data unavailable');
  const data = await res.json();
  return data.matches.map(mapApiMatch);
};

export const getStandings = async (): Promise<Standing[]> => {
  const res = await fetch('/api/standings');
  if (!res.ok) throw new Error('Data unavailable');
  const data = await res.json();
  return data.standings.map((s: any) => ({
    group: s.group,
    table: s.table.map((t: any) => ({
      position: t.position,
      team: {
        id: t.team.id,
        name: t.team.name,
        shortName: t.team.shortName || t.team.tla,
        crest: t.team.crest,
      },
      playedGames: t.playedGames,
      won: t.won,
      draw: t.draw,
      lost: t.lost,
      points: t.points,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      goalDifference: t.goalDifference,
    })),
  }));
};
export const getMatchDetail = async (id: string): Promise<any> => {
  const res = await fetch(`/api/matches/${id}`);
  if (!res.ok) throw new Error('Data unavailable');
  return res.json();
};
