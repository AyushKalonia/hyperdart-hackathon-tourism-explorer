import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Star,
  ExternalLink,
  Navigation,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';

export default function AttractionCard({
  attraction,
  isSelected,
  onSelect,
  onOpenDetails,
  onShowOnMap,
  format
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [cardImage, setCardImage] = useState(attraction.imageUrl || null);

  // Dynamically resolve image from Wikipedia if not provided or updated
  useEffect(() => {
    setCardImage(attraction.imageUrl || null);

    if (!attraction.imageUrl && attraction.name) {
      let isCurrent = true;
      const clean = attraction.name.trim();
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        clean
      )}&gsrlimit=3&prop=pageimages&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;

      fetch(wikiUrl)
        .then((r) => r.json())
        .then((data) => {
          if (!isCurrent) return;
          const pages = Object.values(data?.query?.pages || {});
          pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
          for (const p of pages) {
            if (p?.thumbnail?.source) {
              setCardImage(p.thumbnail.source);
              break;
            }
          }
        })
        .catch(() => {});

      return () => {
        isCurrent = false;
      };
    }
  }, [attraction.imageUrl, attraction.name]);

  // Cancel any active speech on card unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text to speech snippet
  const handleToggleAudio = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${attraction.name}. ${attraction.category}. ${attraction.description || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleOpenGoogleMapsLocation = (e) => {
    e.stopPropagation();
    if (typeof onShowOnMap === 'function') {
      try {
        onShowOnMap(attraction);
      } catch {}
    }
    const query = attraction.address
      ? `${attraction.name}, ${attraction.address}`
      : attraction.name
        ? `${attraction.name}`
        : `${attraction.lat},${attraction.lon}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirections = (e) => {
    e.stopPropagation();
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.lat},${attraction.lon}&destination_place_id=${encodeURIComponent(
      attraction.name
    )}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const formattedDistance =
    attraction.distanceMeters != null
      ? attraction.distanceMeters < 1000
        ? `${attraction.distanceMeters}m away`
        : `${(attraction.distanceMeters / 1000).toFixed(1)} km away`
      : null;

  // Warm sunset placeholder gradient if no image URL
  const fallbackGradient =
    'linear-gradient(135deg, rgba(255, 147, 62, 0.25) 0%, rgba(255, 203, 86, 0.45) 50%, rgba(255, 233, 169, 0.75) 100%)';

  const isCompact = format === 'sidebar';

  return (
    <div
      className={`tourism-card ${isSelected ? 'is-active' : ''}`}
      onClick={() => onSelect(attraction)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: isCompact ? 'column' : 'column',
        marginBottom: '14px'
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isCompact ? '130px' : '170px',
          backgroundColor: 'var(--color-border)',
          overflow: 'hidden'
        }}
      >
        {cardImage ? (
          <img
            src={cardImage}
            alt={attraction.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onError={() => {
              // Try dynamic Wikimedia Commons lookup for place name
              if (attraction.name) {
                const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
                  attraction.name
                )}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json&origin=*`;
                fetch(commonsUrl)
                  .then((r) => r.json())
                  .then((d) => {
                    const pages = Object.values(d?.query?.pages || {});
                    pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
                    const thumb = pages[0]?.imageinfo?.[0]?.thumburl;
                    if (thumb && thumb !== cardImage) {
                      setCardImage(thumb);
                    } else {
                      setCardImage(null);
                    }
                  })
                  .catch(() => setCardImage(null));
              } else {
                setCardImage(null);
              }
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: fallbackGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}
          >
            <Compass size={36} opacity={0.7} />
          </div>
        )}

        {/* Category tag */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(53, 43, 35, 0.88)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{attraction.category}</span>
        </div>

        {/* Audio guide & Rating pill */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {'speechSynthesis' in window && (
            <button
              type="button"
              onClick={handleToggleAudio}
              title={isPlayingAudio ? 'Stop audio' : 'Listen to audio snippet'}
              style={{
                border: 'none',
                background: isPlayingAudio ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.92)',
                color: isPlayingAudio ? '#ffffff' : 'var(--color-text)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          )}

          {attraction.rating && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--color-text)',
                padding: '3px 7px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Star size={12} fill="#FFCB56" color="#FFCB56" />
              <span>{attraction.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: isCompact ? '12px' : '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: isCompact ? '15px' : '16px',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.3
            }}
          >
            {attraction.name}
          </h3>
        </div>

        {/* Distance & Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            marginTop: '6px',
            flexWrap: 'wrap'
          }}
        >
          {formattedDistance && (
            <span
              style={{
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Navigation size={12} /> {formattedDistance}
            </span>
          )}
          {attraction.address && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '220px'
              }}
              title={attraction.address}
            >
              <MapPin size={12} color="var(--color-text-secondary)" /> {attraction.address}
            </span>
          )}
        </div>

        {/* Short description */}
        {attraction.description && (
          <p
            style={{
              margin: '8px 0 12px 0',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: isCompact ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {attraction.description}
          </p>
        )}

        {/* Actions row */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '8px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px'
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={handleOpenGoogleMapsLocation}
            title={`View ${attraction.name} location on Google Maps`}
            style={{ padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <MapPin size={13} color="var(--color-primary)" />
            <span>Map</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleDirections}
              title="Open directions in Google Maps"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <Navigation size={13} color="var(--color-primary)" />
              <span>Route</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(attraction);
              }}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <span>Details</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
