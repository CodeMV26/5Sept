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
    console.error('Errore durante il recupero delle partite:', error);
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
    console.error('Errore durante il recupero delle competizioni:', error);
    return [];
  }
}

export async function getMatches(competitionCode?: string) {
  return fetchMatches(competitionCode || 'SA');
}

export async function getCompetitions() {
  return fetchCompetitions();
}

export default {
  COMPETITIONS,
  fetchMatches,
  fetchCompetitions,
  getMatches,
  getCompetitions,
};