const BASE_URL = '/football-data';
const API_KEY = 'e0ca06c07c634d4fb0950365bd82ffd0';

const headers = {
  'X-Auth-Token': API_KEY,
};

export async function fetchMatches(competitionCode: string) {
  try {
    const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/matches`, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
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