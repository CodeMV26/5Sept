const BASE_URL = '/football-data';

export const COMPETITIONS = [
  { code: 'SA', name: 'Serie A' },
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'La Liga' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'CL', name: 'Champions League' }
];

async function safeFetch(endpoint: string) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Errore durante il recupero da ${endpoint}:`, error);
    return null;
  }
}

export async function fetchMatches(competitionCode: string = 'SA') {
  const data = await safeFetch(`/competitions/${competitionCode}/matches`);
  return data?.matches || [];
}

export async function fetchUpcomingMatches(competitionCode: string = 'SA') {
  const data = await safeFetch(`/competitions/${competitionCode}/matches?status=SCHEDULED`);
  return data?.matches || [];
}

export async function fetchCompetitions() {
  const data = await safeFetch(`/competitions`);
  return data?.competitions || [];
}

export async function fetchStandings(competitionCode: string = 'SA') {
  const data = await safeFetch(`/competitions/${competitionCode}/standings`);
  return data?.standings || [];
}

export async function getMatches(competitionCode?: string) {
  return fetchMatches(competitionCode || 'SA');
}

export async function getUpcomingMatches(competitionCode?: string) {
  return fetchUpcomingMatches(competitionCode || 'SA');
}

export async function getCompetitions() {
  return fetchCompetitions();
}

export async function getStandings(competitionCode?: string) {
  return fetchStandings(competitionCode || 'SA');
}

export default {
  COMPETITIONS,
  fetchMatches,
  fetchUpcomingMatches,
  fetchCompetitions,
  fetchStandings,
  getMatches,
  getUpcomingMatches,
  getCompetitions,
  getStandings,
};