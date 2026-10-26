import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  ExternalLink,
  Star,
  Volume2,
  VolumeX,
  Compass,
  Share2,
  Calendar,
  Check
} from 'lucide-react';

export default function AttractionDetailModal({
  attraction,
  onClose,
  onAddToPlanner,
  isInPlanner = false
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [modalImage, setModalImage] = useState(attraction?.imageUrl || null);

  // Dynamically resolve high-res image from Wikipedia if missing
  useEffect(() => {
    setModalImage(attraction?.imageUrl || null);
    if (!attraction?.imageUrl && attraction?.name) {
      let isCurrent = true;
      const clean = attraction.name.trim();
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        clean
      )}&gsrlimit=3&prop=pageimages&piprop=thumbnail&pithumbsize=1200&format=json&origin=*`;

      fetch(wikiUrl)
        .then((r) => r.json())
        .then((data) => {
          if (!isCurrent) return;
          const pages = Object.values(data?.query?.pages || {});
          pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
          for (const p of pages) {
            if (p?.thumbnail?.source) {
              setModalImage(p.thumbnail.source);
              break;
            }
          }
        })
        .catch(() => {});

      return () => {
        isCurrent = false;
      };
    }
  }, [attraction?.imageUrl, attraction?.name]);

  // Keyboard and speech cleanup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onClose]);

  if (!attraction) return null;

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${attraction.name}. ${attraction.category}. Located at ${
        attraction.address || 'the destination center'
      }. ${attraction.description || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleOpenMapLocation = () => {
    const query = attraction.address
      ? `${attraction.name}, ${attraction.address}`
      : attraction.name
        ? `${attraction.name}`
        : `${attraction.lat},${attraction.lon}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirections = () => {
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.lat},${attraction.lon}&destination_place_id=${encodeURIComponent(
      attraction.name
    )}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: attraction.name,
          text: `Check out ${attraction.name} in Tourism Explorer!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(
          `${attraction.name} - ${attraction.address || ''} (${attraction.lat}, ${attraction.lon})`
        );
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // User dismissed
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(53, 43, 35, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 16px 24px 16px',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="tourism-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Modal Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            backgroundColor: 'var(--color-border)',
            flexShrink: 0
          }}
        >
          {modalImage ? (
            <img
              src={modalImage}
              alt={attraction.name}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(135deg, rgba(255, 147, 62, 0.3) 0%, rgba(255, 203, 86, 0.5) 50%, rgba(255, 233, 169, 0.8) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Compass size={56} opacity={0.7} />
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(53, 43, 35, 0.65)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={18} />
          </button>

          {/* Category Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(53, 43, 35, 0.88)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {attraction.category}
          </div>
        </div>

        {/* Modal Body */}
        <div className="custom-scroll" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--color-text)' }}>
              {attraction.name}
            </h2>
            {attraction.rating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--color-cream)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: 'var(--color-text)'
                }}
              >
                <Star size={14} fill="#FFCB56" color="#FFCB56" />
                <span>{attraction.rating}</span>
              </div>
            )}
          </div>

          {/* Location row */}
          {attraction.address && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                marginTop: '8px'
              }}
            >
              <MapPin size={15} color="var(--color-primary)" />
              <span>{attraction.address}</span>
            </div>
          )}

          {/* Distance & Source info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginTop: '6px'
            }}
          >
            {attraction.distanceMeters && (
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                ~{(attraction.distanceMeters / 1000).toFixed(1)} km from destination center
              </span>
            )}
            {attraction.source && <span>Verified via {attraction.source}</span>}
          </div>

          {/* Description */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              About this attraction
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)'
              }}
            >
              {attraction.description ||
                'A celebrated destination known for its cultural heritage and scenic beauty, attracting visitors and travellers worldwide.'}
            </p>
          </div>

          {/* Coordinates Details */}
          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: 'var(--color-background)',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}
          >
            <span style={{ color: 'var(--color-text-secondary)' }}>Coordinates:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text)' }}>
              {attraction.lat?.toFixed(5)}, {attraction.lon?.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Modal Footer Toolbar */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            background: 'var(--color-surface)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {'speechSynthesis' in window && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleToggleAudio}
                style={{ padding: '8px 12px', fontSize: '13px' }}
              >
                {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={handleShare}
              title="Share or copy info"
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              {copiedLink ? <Check size={15} color="#16a34a" /> : <Share2 size={15} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleOpenMapLocation}
              title="Open location on Google Maps"
              style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <MapPin size={15} color="var(--color-primary)" />
              <span>Location</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleDirections}
              title="Open directions in Google Maps"
              style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Navigation size={15} />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
