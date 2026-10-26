import React from 'react';
import AttractionCard from './AttractionCard';

export default function AttractionGrid({
  attractions = [],
  selectedAttraction,
  onSelectAttraction,
  onOpenDetails,
  onShowOnMap,
  format,
  destinationName,
  category
}) {
  const isCompact = format === 'sidebar';

  return (
    <div>
      {/* Header with count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <h2
            style={{
              fontSize: isCompact ? '16px' : '20px',
              fontWeight: 700,
              color: 'var(--color-text)',
              margin: 0
            }}
          >
            {destinationName ? `Sights in ${destinationName}` : 'Attractions'}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Showing {attractions.length} verified {category !== 'all' ? category : 'tourist'} spots
          </span>
        </div>
      </div>

      {/* Grid or List layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px'
        }}
      >
        {attractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            isSelected={selectedAttraction?.id === attraction.id}
            onSelect={onSelectAttraction}
            onOpenDetails={onOpenDetails}
            onShowOnMap={onShowOnMap}
            format={format}
          />
        ))}
      </div>
    </div>
  );
}
