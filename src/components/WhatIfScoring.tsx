import { useState, useEffect, useCallback } from 'react';
import type { MatchAnalysis, ScoringWeights, WhatIfResult } from '../types/hirelens';
import { DEFAULT_WEIGHTS } from '../types/hirelens';
import { computeWhatIfRankings } from '../services/matcherEngine';

interface WhatIfScoringProps {
  rankings: MatchAnalysis[];
  onClose: () => void;
}

type WeightKey = keyof ScoringWeights;

const SLIDER_CONFIG: { key: WeightKey; label: string; icon: string; color: string }[] = [
  { key: 'requiredSkills',  label: 'Required Skills',  icon: '🎯', color: '#6366f1' },
  { key: 'experience',      label: 'Experience',        icon: '⏳', color: '#10b981' },
  { key: 'projects',        label: 'Projects',          icon: '🔨', color: '#f59e0b' },
  { key: 'preferredSkills', label: 'Preferred Skills',  icon: '⭐', color: '#8b5cf6' },
  { key: 'education',       label: 'Education / Certs', icon: '🎓', color: '#06b6d4' },
];

function rankDeltaBadge(delta: number) {
  if (delta === 0) return <span style={{ color: '#94a3b8', fontWeight: 600 }}>─</span>;
  if (delta > 0)  return <span style={{ color: '#10b981', fontWeight: 700 }}>▲{delta}</span>;
  return              <span style={{ color: '#ef4444', fontWeight: 700 }}>▼{Math.abs(delta)}</span>;
}

function tierColor(score: number) {
  if (score >= 85) return '#10b981';
  if (score >= 72) return '#6366f1';
  if (score >= 58) return '#f59e0b';
  if (score >= 42) return '#94a3b8';
  return '#ef4444';
}

export function WhatIfScoring({ rankings, onClose }: WhatIfScoringProps) {
  const [weights, setWeights] = useState<ScoringWeights>({ ...DEFAULT_WEIGHTS });
  const [results, setResults] = useState<WhatIfResult[]>([]);
  const [lockedKey, setLockedKey] = useState<WeightKey | null>(null);

  const total = Object.values(weights).reduce((s, v) => s + v, 0);

  // Recalculate when weights change
  useEffect(() => {
    if (rankings.length === 0) return;
    setResults(computeWhatIfRankings(rankings, weights));
  }, [weights, rankings]);

  // Adjust a single slider, redistributing the remainder across the unlocked sliders
  const handleSliderChange = useCallback((changedKey: WeightKey, rawValue: number) => {
    setWeights(prev => {
      const clamped = Math.max(0, Math.min(100, rawValue));
      const others = SLIDER_CONFIG.map(c => c.key).filter(k => k !== changedKey && k !== lockedKey);
      const fixedSum = lockedKey ? prev[lockedKey] : 0;
      const remaining = Math.max(0, 100 - clamped - fixedSum);
      const otherCurrentSum = others.reduce((s, k) => s + prev[k], 0);

      const next = { ...prev, [changedKey]: clamped } as ScoringWeights;
      if (others.length > 0) {
        if (otherCurrentSum <= 0) {
          const share = Math.round(remaining / others.length);
          others.forEach((k, i) => {
            next[k] = i === others.length - 1
              ? remaining - share * (others.length - 1)
              : share;
          });
        } else {
          let distributed = 0;
          others.slice(0, -1).forEach(k => {
            const share = Math.round((prev[k] / otherCurrentSum) * remaining);
            next[k] = share;
            distributed += share;
          });
          next[others[others.length - 1]] = remaining - distributed;
        }
      }
      // Clamp all to [0,100]
      (Object.keys(next) as WeightKey[]).forEach(k => {
        next[k] = Math.max(0, Math.min(100, next[k]));
      });
      return next;
    });
  }, [lockedKey]);

  const handleReset = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
    setLockedKey(null);
  };

  const isDefault = JSON.stringify(weights) === JSON.stringify(DEFAULT_WEIGHTS);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(2,6,23,0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '20px',
        width: '100%', maxWidth: '860px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(99,102,241,0.06)',
        }}>
          <span style={{ fontSize: '26px' }}>🔮</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>
              What-If Scoring
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Adjust weights to instantly see how candidate rankings change.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isDefault && (
              <button onClick={handleReset} style={{
                padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.4)',
                background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontSize: '13px',
                cursor: 'pointer', fontWeight: 600,
              }}>↺ Reset</button>
            )}
            <button onClick={onClose} style={{
              padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '13px',
              cursor: 'pointer', fontWeight: 600,
            }}>✕ Close</button>
          </div>
        </div>

        <div style={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Sliders Panel */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Total bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
                Total weight: &nbsp;
                <span style={{
                  fontWeight: 700,
                  color: Math.abs(total - 100) < 1 ? '#10b981' : '#ef4444',
                }}>
                  {total}%
                </span>
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                🔒 Click a lock icon to freeze that weight while adjusting others
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SLIDER_CONFIG.map(({ key, label, icon, color }) => {
                const val = weights[key];
                const isLocked = lockedKey === key;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      title={isLocked ? 'Unlock' : 'Lock this weight'}
                      onClick={() => setLockedKey(isLocked ? null : key)}
                      style={{
                        fontSize: '15px', background: 'none', border: 'none',
                        cursor: 'pointer', opacity: isLocked ? 1 : 0.35,
                        transition: 'opacity 0.15s',
                        flexShrink: 0,
                      }}
                    >{isLocked ? '🔒' : '🔓'}</button>

                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>

                    <span style={{
                      width: '130px', fontSize: '13px', color: '#cbd5e1',
                      fontWeight: 500, flexShrink: 0,
                    }}>{label}</span>

                    <input
                      type="range"
                      min={0} max={100} step={1}
                      value={val}
                      disabled={isLocked}
                      onChange={e => handleSliderChange(key, parseInt(e.target.value))}
                      style={{
                        flex: 1, accentColor: color, cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.5 : 1,
                      }}
                    />

                    <span style={{
                      width: '42px', textAlign: 'right',
                      fontSize: '14px', fontWeight: 700,
                      color, flexShrink: 0,
                    }}>{val}%</span>

                    {/* Mini bar */}
                    <div style={{
                      width: '60px', height: '6px', borderRadius: '3px',
                      background: 'rgba(255,255,255,0.08)', overflow: 'hidden', flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${val}%`, height: '100%',
                        background: color, borderRadius: '3px',
                        transition: 'width 0.1s',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Table */}
          <div style={{ padding: '20px 28px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Updated Rankings
            </h3>

            {results.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
                Analyse candidates first to see what-if results.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.map(r => (
                  <div key={r.candidateId} style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr 70px 60px 60px',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: r.rankDelta > 0
                      ? 'rgba(16,185,129,0.07)'
                      : r.rankDelta < 0
                        ? 'rgba(239,68,68,0.06)'
                        : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'background 0.2s',
                  }}>
                    {/* Rank badge */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: r.newRank === 1 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700,
                      color: r.newRank === 1 ? '#1a1a1a' : '#94a3b8',
                    }}>#{r.newRank}</div>

                    {/* Name + reason */}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '2px' }}>
                        {r.candidateName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {r.changeReason}
                      </div>
                    </div>

                    {/* New score */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '18px', fontWeight: 800,
                        color: tierColor(r.newScore),
                      }}>{r.newScore}</div>
                      <div style={{ fontSize: '10px', color: '#475569' }}>score</div>
                    </div>

                    {/* Original rank */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#475569' }}>was #{r.originalRank}</div>
                    </div>

                    {/* Rank delta */}
                    <div style={{ textAlign: 'center', fontSize: '15px' }}>
                      {rankDeltaBadge(r.rankDelta)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
