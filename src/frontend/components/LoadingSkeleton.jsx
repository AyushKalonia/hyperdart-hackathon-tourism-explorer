import React from 'react';

export default function LoadingSkeleton({ format }) {
  const isCompact = format === 'sidebar';
  const skeletonCount = isCompact ? 3 : 4;

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <div className="skeleton" style={{ width: '180px', height: '22px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '120px', height: '14px' }} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px'
        }}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="tourism-card"
            style={{
              padding: '0',
              overflow: 'hidden',
              height: isCompact ? '260px' : '320px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="skeleton" style={{ width: '100%', height: isCompact ? '120px' : '160px', borderRadius: '0' }} />
            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ width: '70%', height: '18px' }} />
              <div className="skeleton" style={{ width: '45%', height: '12px' }} />
              <div className="skeleton" style={{ width: '90%', height: '12px', marginTop: '6px' }} />
              <div className="skeleton" style={{ width: '80%', height: '12px' }} />
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                <div className="skeleton" style={{ width: '60px', height: '26px' }} />
                <div className="skeleton" style={{ width: '70px', height: '26px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
