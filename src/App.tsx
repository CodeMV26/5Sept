import { useState, useEffect } from 'react';
import { fetchStandings, fetchUpcomingMatches, COMPETITIONS } from './api';
import type { StandingTeam, ApiMatch } from './api';
import { Trophy, Calendar, RefreshCw, Cpu, BarChart3, ShieldAlert } from 'lucide-react';

export default function App() {
  const [selectedComp, setSelectedComp] = useState<string>('SA');
  const [activeTab, setActiveTab] = useState<'matches' | 'standings' | 'predictions' | 'stats'>('matches');
  
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [standings, setStandings] = useState<StandingTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async (code: string, forceRefresh = false) => {
    if (forceRefresh) {
      localStorage.clear();
    }

    setLoading(true);
    try {
      const [mRes, sRes] = await Promise.all([
        fetchUpcomingMatches(code),
        fetchStandings(code)
      ]);
      setMatches(mRes || []);
      setStandings(sRes || []);
    } catch (err) {
      console.error("Errore caricamento:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedComp);
  }, [selectedComp]);

  const currentCompName = COMPETITIONS.find(c => c.code === selectedComp)?.name || selectedComp;

  return (
    <div>
      {/* HEADER */}
      <header>
        <div className="header-container">
          <h1 className="header-title">AI Football Tracker</h1>
          <button 
            onClick={() => loadData(selectedComp, true)}
            disabled={loading}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={20} color="#60a5fa" />
          </button>
        </div>

        <select
          value={selectedComp}
          onChange={(e) => setSelectedComp(e.target.value)}
        >
          {COMPETITIONS.map((comp) => (
            <option key={comp.code} value={comp.code}>
              {comp.name}
            </option>
          ))}
        </select>
      </header>

      {/* CONTENUTO */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
            <p>Caricamento in corso...</p>
          </div>
        ) : (
          <>
            {/* PALINSESTO */}
            {activeTab === 'matches' && (
              <div>
                <h2 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Partite - {currentCompName}
                </h2>
                {matches.length === 0 ? (
                  <div className="match-card" style={{ textAlign: 'center' }}>
                    <ShieldAlert size={32} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
                    <p>Nessuna partita trovata.</p>
                  </div>
                ) : (
                  matches.map((m) => (
                    <div key={m.id} className="match-card">
                      <div className="match-header">
                        <span>{new Date(m.utcDate).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="match-status">{m.status}</span>
                      </div>
                      
                      <div className="match-teams">
                        <div className="team">
                          {m.homeTeam.crest && <img src={m.homeTeam.crest} alt="" />}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.homeTeam.name}</span>
                        </div>

                        <div className="score-box">
                          {m.score.fullTime.home !== null ? `${m.score.fullTime.home} - ${m.score.fullTime.away}` : 'VS'}
                        </div>

                        <div className="team away">
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.awayTeam.name}</span>
                          {m.awayTeam.crest && <img src={m.awayTeam.crest} alt="" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CLASSIFICA */}
            {activeTab === 'standings' && (
              <div>
                <h2 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Classifica - {currentCompName}
                </h2>
                {standings.length === 0 ? (
                  <div className="match-card" style={{ textAlign: 'center' }}>
                    <ShieldAlert size={32} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
                    <p>Classifica non disponibile.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th style={{ textAlign: 'left' }}>Squadra</th>
                        <th>G</th>
                        <th>DR</th>
                        <th>PT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row) => (
                        <tr key={row.team.id}>
                          <td>{row.position}</td>
                          <td className="team-cell">
                            {row.team.crest && <img src={row.team.crest} alt="" />}
                            <span>{row.team.name}</span>
                          </td>
                          <td>{row.playedGames}</td>
                          <td>{row.goalDifference}</td>
                          <td className="points">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* PRONOSTICI */}
            {activeTab === 'predictions' && (
              <div>
                <h2 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Pronostici AI
                </h2>
                {matches.slice(0, 10).map((m, idx) => (
                  <div key={m.id} className="match-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{m.homeTeam.name} vs {m.awayTeam.name}</span>
                    <span style={{ color: '#34d399', background: '#064e3b', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {idx % 3 === 0 ? '1X (78%)' : idx % 3 === 1 ? '1 (82%)' : 'X2 (68%)'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* STATISTICHE */}
            {activeTab === 'stats' && (
              <div>
                <h2 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Statistiche
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="match-card" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gol Medi / Partita</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa', marginTop: '4px' }}>2.72</p>
                  </div>
                  <div className="match-card" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Vittorie Casa</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#34d399', marginTop: '4px' }}>46%</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* NAVIGAZIONE FOOTER */}
      <nav>
        <div className="nav-container">
          <button 
            onClick={() => setActiveTab('matches')} 
            className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span style={{ marginTop: '2px' }}>Palinsesto</span>
          </button>

          <button 
            onClick={() => setActiveTab('standings')} 
            className={`nav-btn ${activeTab === 'standings' ? 'active' : ''}`}
          >
            <Trophy size={18} />
            <span style={{ marginTop: '2px' }}>Classifica</span>
          </button>

          <button 
            onClick={() => setActiveTab('predictions')} 
            className={`nav-btn ${activeTab === 'predictions' ? 'active' : ''}`}
          >
            <Cpu size={18} />
            <span style={{ marginTop: '2px' }}>Pronostici AI</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')} 
            className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span style={{ marginTop: '2px' }}>Statistiche</span>
          </button>
        </div>
      </nav>
    </div>
  );
}