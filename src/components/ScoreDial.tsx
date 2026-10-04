import React from 'react';

interface ScoreDialProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const ScoreDial: React.FC<ScoreDialProps> = ({
  score,
  size = 72,
  strokeWidth = 6,
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Determine color scheme based on score
  let strokeColor = '#10b981'; // emerald
  let textColor = '#34d399';

  if (score < 45) {
    strokeColor = '#f43f5e'; // rose
    textColor = '#fb7185';
  } else if (score < 65) {
    strokeColor = '#f59e0b'; // amber
    textColor = '#fbbf24';
  } else if (score < 80) {
    strokeColor = '#3b82f6'; // blue
    textColor = '#60a5fa';
  }

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Filled Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${strokeColor}66)`,
          }}
        />
      </svg>
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: size > 80 ? '1.5rem' : '1.1rem',
              fontWeight: 800,
              color: textColor,
              letterSpacing: '-0.02em',
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted, #94a3b8)',
              marginTop: '1px',
            }}
          >
            /100
          </span>
        </div>
      )}
    </div>
  );
};
