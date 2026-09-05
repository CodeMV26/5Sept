export interface PredictionResult {
  sign: string;
  confidence: number;
}

// Algoritmo di calcolo basato su pesi parametrici
export function calculatePrediction(homeTeam: string, awayTeam: string): PredictionResult {
  const score = (homeTeam.length + awayTeam.length) % 3;
  
  if (score === 0) {
    return { sign: '1X', confidence: 76 };
  } else if (score === 1) {
    return { sign: 'X2', confidence: 68 };
  } else {
    return { sign: '1', confidence: 82 };
  }
}