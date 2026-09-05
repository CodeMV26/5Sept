const API_KEY = 'e0ca06c07c634d4fb0950365bd82ffd0';

export interface StandingTeam {
  position: number;
  team: { id: number; name: string; crest: string };
  points: number;
  goalDifference: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
}

export interface ApiMatch {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
}

export const COMPETITIONS = [
  { code: 'SA', name: '🇮🇹 Serie A' },
  { code: 'PL', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { code: 'CL', name: '🇪🇺 UEFA Champions League' },
  { code: 'BL1', name: '🇩🇪 Bundesliga' },
  { code: 'PD', name: '🇪🇸 La Liga' },
  { code: 'FL1', name: '🇫🇷 Ligue 1' },
  { code: 'DED', name: '🇳🇱 Eredivisie' },
  { code: 'PPL', name: '🇵🇹 Primeira Liga' },
  { code: 'ELC', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Championship' },
  { code: 'BSA', name: '🇧🇷 Brasileirão' },
  { code: 'WC', name: '🌍 FIFA World Cup' },
  { code: 'EC', name: '🇪🇺 European Championship' }
];

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 ora di cache locale

function getCachedData<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp < CACHE_TTL_MS) return data;
  } catch {
    return null;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.error("Errore salvataggio cache:", e);
  }
}

// Fetch Classifica da Football-Data.org
export async function fetchStandings(compCode: string): Promise<StandingTeam[]> {
  const cacheKey = `fd_standings_${compCode}`;
  const cached = getCachedData<StandingTeam[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`/football-data/competitions/${compCode}/standings`, {
      method: 'GET',
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await response.json();

    if (data.standings && data.standings.length > 0) {
      const table = data.standings[0].table;
      setCachedData(cacheKey, table);
      return table;
    }
  } catch (error) {
    console.error(`Errore fetch classifica ${compCode}:`, error);
  }
  return [];
}

// Fetch Partite da Football-Data.org
export async function fetchUpcomingMatches(compCode: string): Promise<ApiMatch[]> {
  const cacheKey = `fd_matches_${compCode}`;
  const cached = getCachedData<ApiMatch[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`/football-data/competitions/${compCode}/matches`, {
      method: 'GET',
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await response.json();

    if (data.matches && data.matches.length > 0) {
      setCachedData(cacheKey, data.matches);
      return data.matches;
    }
  } catch (error) {
    console.error(`Errore fetch partite ${compCode}:`, error);
  }
  return [];
}