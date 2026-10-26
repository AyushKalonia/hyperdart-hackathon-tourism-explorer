import React, { useState, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';

const QUICK_QUERIES = [
  { label: 'Kurukshetra', query: 'best places to visit in Kurukshetra' },
  { label: 'NYC', query: 'Tourist attractions in NYC' },
  { label: 'Paris', query: 'Things to do in Paris' },
  { label: 'Rome', query: 'Landmarks in Rome' },
  { label: 'Delhi', query: 'museums in Delhi' },
  { label: 'Varanasi', query: 'Temples in Varanasi' },
  { label: 'Tokyo', query: 'Sights near Tokyo' }
];

export default function SearchBar({ initialQuery = '', onSearch, format }) {
  const [queryInput, setQueryInput] = useState(initialQuery);

  // Synchronize input when external query selection occurs
  useEffect(() => {
    setQueryInput(initialQuery || '');
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearch(queryInput.trim());
    }
  };

  const handleQuickSelect = (q) => {
    setQueryInput(q);
    onSearch(q);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '12px',
          padding: '4px 6px 4px 12px',
          boxShadow: 'var(--shadow-sm)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
        }}>
          <Search size={18} color="var(--color-primary)" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search attractions (e.g. museums in Delhi, things to do in Paris)..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: format === 'sidebar' ? '13px' : '14px',
              fontFamily: 'inherit',
              color: 'var(--color-text)'
            }}
          />
          {queryInput && (
            <button
              type="button"
              onClick={() => setQueryInput('')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '4px',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: format === 'sidebar' ? '7px 12px' : '8px 16px',
              fontSize: '13px',
              marginLeft: '6px'
            }}
          >
            Explore
          </button>
        </div>
      </form>

      {/* Quick destination suggestion chips */}
      <div
        className="custom-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '10px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          whiteSpace: 'nowrap'
        }}>
          <MapPin size={12} color="var(--color-primary)" /> Popular:
        </span>
        {QUICK_QUERIES.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleQuickSelect(item.query)}
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              borderRadius: '9999px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
