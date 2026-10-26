import React from 'react';
import { Compass, Moon, Sun, Layout, Calendar, Sparkles } from 'lucide-react';

export default function BrandHeader({
  destinationName,
  isDark,
  onToggleTheme,
  format,
  onToggleFormat,
  onOpenPlanner,
  attractionsCount = 0
}) {
  return (
    <header className="tourism-brand-header" style={{
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      padding: format === 'sidebar' ? '12px 16px' : '16px 24px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(255, 147, 62, 0.28)'
          }}>
            <Compass size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: format === 'sidebar' ? '16px' : '18px',
                color: 'var(--color-text)'
              }}>
                Tourism<span style={{ color: 'var(--color-primary)' }}>Explorer</span>
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '6px',
                background: 'var(--color-cream)',
                color: 'var(--color-text)'
              }}>
                hyperDart
              </span>
            </div>
            {format !== 'sidebar' && (
              <p style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                margin: 0
              }}>
                Explore Beyond the Ordinary
              </p>
            )}
          </div>
        </div>

        {/* Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* AI Day Planner Trigger Button */}
          <button
            type="button"
            onClick={attractionsCount > 0 ? onOpenPlanner : undefined}
            disabled={attractionsCount === 0}
            title={attractionsCount > 0 ? 'Create AI Day Plan' : 'Search a destination to generate an itinerary'}
            style={{
              background: attractionsCount > 0 ? 'var(--brand-gradient)' : 'var(--color-border)',
              color: attractionsCount > 0 ? '#ffffff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              padding: format === 'sidebar' ? '6px 12px' : '7px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: attractionsCount > 0 ? 'pointer' : 'not-allowed',
              opacity: attractionsCount > 0 ? 1 : 0.65,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: attractionsCount > 0 ? '0 3px 10px rgba(255, 147, 62, 0.28)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} />
            <span>{format === 'sidebar' ? 'Day Plan' : 'AI Day Planner'}</span>
          </button>

          {/* Format Switcher (Mainline / Sidebar evaluator toggle) */}
          <button
            type="button"
            onClick={onToggleFormat}
            className="btn-icon"
            title={`Switch to ${format === 'sidebar' ? 'Mainline view' : 'Sidebar view'}`}
            style={{ fontSize: '12px', fontWeight: 600, gap: '4px', padding: '6px 10px' }}
          >
            <Layout size={15} />
            <span style={{ fontSize: '11px' }}>{format === 'sidebar' ? 'Wide' : 'Sidebar'}</span>
          </button>

          {/* Theme Switcher (Light / Dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-icon"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} color="var(--color-accent)" /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
