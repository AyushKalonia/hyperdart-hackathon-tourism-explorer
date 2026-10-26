import React from 'react';
import { Compass, Search, RefreshCw, Globe } from 'lucide-react';

export default function EmptyState({
  destinationName,
  category,
  onResetCategory,
  onExpandRadius,
  format
}) {
  return (
    <div
      className="tourism-card"
      style={{
        textAlign: 'center',
        padding: format === 'sidebar' ? '30px 16px' : '48px 24px',
        margin: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--brand-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(255, 147, 62, 0.28)'
        }}
      >
        <Compass size={28} />
      </div>

      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--color-text)'
        }}
      >
        No attractions found
      </h3>

      <p
        style={{
          margin: '0 0 20px 0',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          maxWidth: '380px',
          lineHeight: 1.5
        }}
      >
        We couldn't find any verified{' '}
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          {category !== 'all' ? category : 'tourist sights'}
        </span>{' '}
        in{' '}
        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
          {destinationName || 'this destination'}
        </span>{' '}
        within the current search area.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {category !== 'all' && (
          <button
            type="button"
            className="btn-primary"
            onClick={onResetCategory}
            style={{ fontSize: '13px' }}
          >
            <Globe size={14} />
            <span>Show all attractions</span>
          </button>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={onExpandRadius}
          style={{ fontSize: '13px' }}
        >
          <Search size={14} />
          <span>Expand search radius</span>
        </button>
      </div>
    </div>
  );
}
