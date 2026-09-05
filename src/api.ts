const BASE_URL = '/football-data';
const API_KEY = 'e0ca06c07c634d4fb0950365bd82ffd0';

const headers = {
  'X-Auth-Token': API_KEY,
};

export const COMPETITIONS = [
  { code: 'SA', name: 'Serie A' },
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'La Liga' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'CL', name: 'Champions League' }
];

export async function fetchMatches(competitionCode: string = 'SA') {
  try {
    const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/matches`, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Errore recupero partite:', error);
    return [];
  }
}

export async function fetchCompetitions() {
  try {
    const response = await fetch(`${BASE_URL}/competitions`, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.competitions || [];
  } catch (error) {
    console.error('Errore recupero competizioni:', error);
    return [];
  }
}

export async function fetchStandings(competitionCode: string = 'SA') {
  try {
    const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/standings`, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.standings || [];
  } catch (error) {
    console.error('Errore recupero classifica:', error);
    return [];
  }
}

export async function getMatches(competitionCode?: string) {
  return fetchMatches(competitionCode || 'SA');
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
  fetchCompetitions,
  fetchStandings,
  getMatches,
  getCompetitions,
  getStandings,
};