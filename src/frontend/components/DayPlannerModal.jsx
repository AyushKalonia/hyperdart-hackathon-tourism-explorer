import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Navigation,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Share2,
  MapPin,
  Camera,
  Landmark,
  Zap,
  Users
} from 'lucide-react';

// Heuristic nearest-neighbor route builder when backend is unreachable (zero API keys required in frontend)
function buildClientHeuristicItinerary(destination, places, preferences = 'balanced sightseeing', durationHours = 8) {
  if (!places || places.length === 0) return null;
  const remaining = [...places];
  const ordered = [];
  let current = remaining.shift();
  ordered.push(current);

  while (remaining.length > 0 && ordered.length < 5) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dLat = (current.lat - remaining[i].lat);
      const dLon = (current.lon - remaining[i].lon);
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    current = remaining.splice(nearestIdx, 1)[0];
    ordered.push(current);
  }

  const slots = [
    { title: 'Morning (09:00 - 11:30)', tip: 'Beat the morning rush; pleasant natural lighting for sightseeing and photos.' },
    { title: 'Midday (11:45 - 14:00)', tip: 'Ideal time for exploration, followed by a relaxing lunch break nearby.' },
    { title: 'Afternoon (14:30 - 17:00)', tip: 'Great afternoon window to discover deeper exhibits and architectural details.' },
    { title: 'Golden Hour & Evening (17:15 - 19:30)', tip: 'Enjoy scenic sunset ambience and evening illuminations.' }
  ];

  const enriched = ordered.slice(0, 4).map((p, idx) => {
    const slot = slots[idx % slots.length];
    const prev = idx > 0 ? ordered[idx - 1] : null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      timeSlot: slot.title,
      duration: '1.5 - 2 hours',
      travelLeg: prev ? `~15-20 min transit from ${prev.name}` : 'Starting point for the day',
      lat: p.lat,
      lon: p.lon,
      address: p.address,
      imageUrl: p.imageUrl,
      rating: p.rating || 4.7,
      reason: `Geographically paired for smooth transit; visit ${p.name} to experience its renowned ${(p.category || 'heritage').toLowerCase()}.`,
      insiderTip: slot.tip
    };
  });

  return {
    destination: destination || 'Selected City',
    mode: 'Smart Route Optimizer',
    model: 'Heuristic Spatial TSP',
    preferences,
    totalPlaces: enriched.length,
    summary: `A balanced ${durationHours}-hour itinerary discovering top sights in ${destination} organized geographically to minimize transit time.`,
    estimatedTotalTravelTime: '~35-45 mins total transit',
    itinerary: enriched
  };
}

const VIBE_OPTIONS = [
  { id: 'balanced sightseeing', label: 'Balanced', icon: Sparkles },
  { id: 'Culture & Heritage', label: 'Culture & Heritage', icon: Landmark },
  { id: 'Photography & Golden Hour', label: 'Photo & Sunset', icon: Camera },
  { id: 'Fast-Paced Explorer', label: 'Highlights', icon: Zap },
  { id: 'Family Friendly', label: 'Family Friendly', icon: Users }
];

export default function DayPlannerModal({
  isOpen,
  onClose,
  destinationName,
  attractions = [],
  apiUrl,
  onSelectAttraction
}) {
  const [duration, setDuration] = useState(8);
  const [preferences, setPreferences] = useState('balanced sightseeing');
  const [loading, setLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchPlan = async () => {
    if (!attractions || attractions.length === 0) return;
    setLoading(true);
    setError(null);

    const placesToPlan = attractions.slice(0, 8);

    // 1. Call secure backend /api/itinerary endpoint (holds Groq API Key server-side)
    try {
      const response = await fetch(`${apiUrl}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destinationName,
          attractions: placesToPlan,
          preferences,
          durationHours: duration
        }),
        signal: AbortSignal.timeout(9000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.itinerary) && data.itinerary.length > 0) {
          setItineraryData(data);
          setLoading(false);
          return;
        }
      }
    } catch (backendErr) {
      console.warn('Backend itinerary API slow or offline, using smart local route optimizer:', backendErr.message);
    }

    // 2. Client-side heuristic route builder fallback (zero keys required)
    try {
      const fallbackPlan = buildClientHeuristicItinerary(destinationName, placesToPlan, preferences, duration);
      if (fallbackPlan) {
        setItineraryData(fallbackPlan);
      } else {
        setError('Unable to build itinerary at this moment. Please try regenerating.');
      }
    } catch (routeErr) {
      console.error('Route optimizer failed:', routeErr);
      setError('Unable to build itinerary at this moment. Please try regenerating.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPlan();
    }
  }, [isOpen, duration, preferences, destinationName]);

  const handleShareRoute = async () => {
    if (!itineraryData) return;
    const summaryText = `${itineraryData.destination} AI Day Plan (${duration} Hours):\n` +
      itineraryData.itinerary.map((s, i) => `${i + 1}. ${s.name} (${s.timeSlot}) - ${s.insiderTip}`).join('\n');

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

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
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="tourism-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--brand-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  AI Day Planner
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(53, 43, 35, 0.55)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.03em'
                  }}
                >
                  Groq Qwen-27B
                </span>
              </div>
              <span style={{ fontSize: '12px', opacity: 0.95 }}>
                Customized route for {destinationName}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Travel Vibe Selector */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
            Style:
          </span>
          {VIBE_OPTIONS.map((vibe) => {
            const Icon = vibe.icon;
            const active = preferences === vibe.id;
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => setPreferences(vibe.id)}
                style={{
                  border: '1px solid',
                  borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                  background: active ? 'var(--color-primary)' : 'var(--color-background)',
                  color: active ? '#ffffff' : 'var(--color-text)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={12} />
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Duration & Regenerate Controls */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Duration:
            </span>
            {[4, 6, 8, 10].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setDuration(h)}
                style={{
                  border: '1px solid var(--color-border)',
                  background: duration === h ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: duration === h ? '#ffffff' : 'var(--color-text-secondary)',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {h}h
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleShareRoute}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '11px', gap: '4px' }}
            >
              <Share2 size={12} />
              <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
            </button>

            <button
              type="button"
              onClick={fetchPlan}
              className="btn-primary"
              disabled={loading}
              style={{ padding: '4px 12px', fontSize: '11px', gap: '4px' }}
            >
              <RefreshCw size={12} className={loading ? 'map-pin-pulse' : ''} />
              <span>Re-plan</span>
            </button>
          </div>
        </div>

        {/* Plan Body */}
        <div className="custom-scroll" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '3px solid var(--color-border)',
                  borderTopColor: 'var(--color-primary)',
                  animation: 'pulse-ring 1s infinite linear',
                  margin: '0 auto 16px auto'
                }}
              />
              <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '16px', color: 'var(--color-text)' }}>
                Groq AI is designing your {duration}-hour plan...
              </p>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Optimizing sequence, timing, and travel legs for {destinationName}
              </span>
            </div>
          ) : itineraryData ? (
            <div>
              {/* Summary card */}
              <div
                style={{
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--color-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>
                      AI Route Overview
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {itineraryData.estimatedTotalTravelTime}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {itineraryData.summary}
                </p>
              </div>

              {/* Timeline Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {itineraryData.itinerary?.map((item, index) => (
                  <div
                    key={item.id || index}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      position: 'relative'
                    }}
                  >
                    {/* Step Number & Connector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: 'var(--brand-gradient)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          boxShadow: '0 2px 6px rgba(255, 147, 62, 0.35)'
                        }}
                      >
                        {index + 1}
                      </div>
                      {index < itineraryData.itinerary.length - 1 && (
                        <div
                          style={{
                            width: '2px',
                            flex: 1,
                            backgroundColor: 'var(--color-border)',
                            margin: '4px 0'
                          }}
                        />
                      )}
                    </div>

                    {/* Step Card */}
                    <div
                      className="tourism-card"
                      style={{
                        flex: 1,
                        padding: '14px',
                        marginBottom: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      {/* Step Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {item.timeSlot}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {item.duration}
                        </span>
                      </div>

                      {/* Title + Thumbnail Preview */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '10px',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        ) : null}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {item.name}
                          </h4>
                          {item.category && (
                            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Transit Leg */}
                      {item.travelLeg && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Navigation size={11} color="var(--color-primary)" />
                          <span>{item.travelLeg}</span>
                        </div>
                      )}

                      {/* AI Sequence Reason */}
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text)', lineHeight: 1.45, opacity: 0.9 }}>
                        {item.reason}
                      </p>

                      {/* AI Insider Tip */}
                      {item.insiderTip && (
                        <div
                          style={{
                            padding: '8px 10px',
                            background: 'var(--color-background)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            color: 'var(--color-text)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px'
                          }}
                        >
                          <Info size={13} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span><strong>Insider Tip:</strong> {item.insiderTip}</span>
                        </div>
                      )}

                      {/* Interactive Focus on Map button */}
                      {typeof onSelectAttraction === 'function' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectAttraction(item);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-primary)',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 6px'
                            }}
                          >
                            <MapPin size={12} />
                            <span>Locate on Map</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '30px 16px' }}>
              <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{error}</p>
              <button type="button" className="btn-primary" onClick={fetchPlan} style={{ marginTop: '10px' }}>
                <RefreshCw size={13} />
                <span>Retry AI Plan</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Powered by Groq High-Speed LLM Inference
          </span>
          <button type="button" className="btn-primary" onClick={onClose} style={{ fontSize: '13px' }}>
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
