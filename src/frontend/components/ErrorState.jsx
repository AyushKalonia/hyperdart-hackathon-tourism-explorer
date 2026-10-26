import React from 'react';
import { AlertCircle, RefreshCw, Sparkles, Compass, ArrowRight, Globe } from 'lucide-react';

export default function ErrorState({
  error,
  onRetry,
  onSelectQuery,
  onResetCategory,
  category,
  format
}) {
  // Normalize error data (supports both Groq AI structured object and plain text)
  const isObject = error && typeof error === 'object';
  const headline = isObject ? error.headline : 'Unable to discover attractions';
  const explanation = isObject
    ? error.explanation || error.message
    : (typeof error === 'string' && error.trim()) || 'An unexpected issue occurred while searching for attractions.';
  const suggestion = isObject ? error.suggestion : null;
  const sampleQueries = isObject && Array.isArray(error.sampleQueries) ? error.sampleQueries : [];
  const isAiPowered = isObject && (error.engine?.includes('Groq') || error.engine?.includes('AI'));

  const isCompact = format === 'sidebar';

  return (
    <div
      className="tourism-card"
      style={{
        textAlign: 'left',
        padding: isCompact ? '24px 18px' : '32px 28px',
        margin: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '18px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 20px rgba(53, 43, 35, 0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative top accent gradient bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--brand-gradient)'
        }}
      />

      {/* Header with status pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 147, 62, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              flexShrink: 0
            }}
          >
            {isAiPowered ? <Sparkles size={22} /> : <AlertCircle size={22} />}
          </div>

          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-primary)'
              }}
            >
              {isAiPowered ? 'Groq AI Search Assistant' : 'Notice'}
            </span>
            <h3
              style={{
                margin: '2px 0 0 0',
                fontSize: isCompact ? '16px' : '18px',
                fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.3
              }}
            >
              {headline}
            </h3>
          </div>
        </div>
      </div>

      {/* Meaningful explanation */}
      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '13.5px',
          color: 'var(--color-text)',
          lineHeight: 1.6,
          opacity: 0.92
        }}
      >
        {explanation}
      </p>

      {/* AI Suggestion Box */}
      {suggestion && (
        <div
          style={{
            backgroundColor: 'rgba(255, 203, 86, 0.15)',
            border: '1px solid rgba(255, 147, 62, 0.25)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}
        >
          <Compass size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
          <p
            style={{
              margin: 0,
              fontSize: '12.5px',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              fontWeight: 500
            }}
          >
            <strong style={{ color: 'var(--color-primary)' }}>Tip: </strong>
            {suggestion}
          </p>
        </div>
      )}

      {/* Clickable AI Sample Query Suggestions */}
      {sampleQueries.length > 0 && typeof onSelectQuery === 'function' && (
        <div style={{ marginBottom: '20px' }}>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-text-secondary)',
              marginBottom: '8px'
            }}
          >
            Explore recommended destinations instead:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectQuery(q)}
                style={{
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span>{q}</span>
                <ArrowRight size={12} opacity={0.6} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recovery action buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>

        {category && category !== 'all' && typeof onResetCategory === 'function' && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onResetCategory}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Globe size={14} />
            <span>Show all categories</span>
          </button>
        )}
      </div>
    </div>
  );
}
