import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './styles.css';

import BrandHeader from './components/BrandHeader';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import WeatherWidget from './components/WeatherWidget';
import AttractionGrid from './components/AttractionGrid';
import MapPanel from './components/MapPanel';
import AttractionDetailModal from './components/AttractionDetailModal';
import DayPlannerModal from './components/DayPlannerModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';

import { parseSearchPayload, extractSearchIntent } from './utils/queryParser';
import { getLocalAttractions, getDirectWeather } from './services/attractionsClient';

export default function TourismExplorerApp(props) {
  // Determine API URL based on hyperDart environment conventions
  const API_URL =
    props.deployedBackendURL ||
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.port === '5173'
      ? ''
      : 'http://localhost:3001');

  // Parse initial payload from props.searchData (handles object or array)
  const parsedInitial = useMemo(() => {
    return parseSearchPayload(props.searchData, props.searchQuery);
  }, [props.searchData, props.searchQuery]);

  // Main search and coordinate states
  const [currentQuery, setCurrentQuery] = useState(parsedInitial.rawQuery);
  const [destinationName, setDestinationName] = useState(parsedInitial.destinationName);
  const [coords, setCoords] = useState({
    lat: parsedInitial.destLat,
    lon: parsedInitial.destLon
  });
  const [activeCategory, setActiveCategory] = useState(parsedInitial.requestedCategory || 'all');
  const [searchRadius, setSearchRadius] = useState(5000);

  // Layout and theme states
  const [format, setFormat] = useState(props.format || parsedInitial.suggestedPlace || 'mainline');
  const [isDark, setIsDark] = useState(
    props.theme === 'dark' || props.theme?.mode === 'dark' || false
  );
  const [isMapCollapsed, setIsMapCollapsed] = useState(format === 'sidebar');

  // Data states
  const [attractions, setAttractions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction states
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [detailAttraction, setDetailAttraction] = useState(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [specificPlace, setSpecificPlace] = useState(null);

  const containerRef = useRef(null);
  const hasNotifiedLoadedRef = useRef(false);
  const searchIdRef = useRef(0);

  // Synchronize when incoming props.searchData changes
  useEffect(() => {
    const updated = parseSearchPayload(props.searchData, props.searchQuery);
    setCurrentQuery(updated.rawQuery);
    setDestinationName(updated.destinationName);
    setCoords({ lat: updated.destLat, lon: updated.destLon });
    setActiveCategory(updated.requestedCategory || 'all');
    setSpecificPlace(null);
    if (props.format) setFormat(props.format);
  }, [props.searchData, props.searchQuery, props.format]);

  // Container width detection for responsive sidebar adaptation
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 600 && !props.format) {
          setFormat('sidebar');
        } else if (width >= 600 && !props.format) {
          setFormat('mainline');
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [props.format]);

  // Fetch Attractions and Weather
  const fetchData = useCallback(async () => {
    if (coords.lat == null || coords.lon == null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let places = [];
    let weatherData = null;

    // 1. Attempt to fetch Attractions from Backend
    try {
      const attractionsUrl = `${API_URL}/api/attractions?lat=${coords.lat}&lon=${coords.lon}&category=${encodeURIComponent(
        activeCategory
      )}&radius=${searchRadius}&destination=${encodeURIComponent(destinationName || '')}&specificPlace=${encodeURIComponent(
        specificPlace || ''
      )}&query=${encodeURIComponent(destinationName || '')}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(attractionsUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.attractions) && data.attractions.length > 0) {
          places = data.attractions;
        }
      }
    } catch (apiErr) {
      console.warn('Backend attractions API unreachable or slow, activating local discovery engine:', apiErr.message);
    }

    // 2. Client-side fallback if backend was unavailable or returned 0 places
    if (!places || places.length === 0) {
      try {
        places = getLocalAttractions({
          query: destinationName,
          lat: coords.lat,
          lon: coords.lon,
          category: activeCategory
        });
      } catch (localErr) {
        console.error('Local discovery engine error:', localErr);
      }
    }

    // 3. Attempt to fetch Weather from Backend with direct Open-Meteo fallback
    try {
      const weatherUrl = `${API_URL}/api/weather?lat=${coords.lat}&lon=${coords.lon}`;
      const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(3000) });
      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        if (wData?.weather) weatherData = wData.weather;
      }
    } catch {
      // Direct client weather call
      weatherData = await getDirectWeather(coords.lat, coords.lon);
    }

    if (!weatherData) {
      weatherData = await getDirectWeather(coords.lat, coords.lon);
    }

    if (places && places.length > 0) {
      setAttractions(places);
      setSelectedAttraction(places[0]);
      setError(null);
    } else {
      setAttractions([]);
      setSelectedAttraction(null);

      // Dynamically fetch meaningful Groq AI error insight with recovery suggestions
      try {
        const insightRes = await fetch(`${API_URL}/api/error-insight`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: destinationName || currentQuery,
            category: activeCategory,
            destination: destinationName,
            errorCode: 'NO_ATTRACTIONS_FOUND'
          })
        });
        if (insightRes.ok) {
          const insightData = await insightRes.json();
          setError(insightData);
        } else {
          setError({
            headline: `No tourist spots found for "${destinationName || currentQuery}"`,
            explanation: `We couldn't discover verified tourist attractions matching this criteria.`,
            suggestion: 'Try checking the spelling, selecting "All Attractions", or searching for a major landmark.',
            sampleQueries: ['Kyoto Temples', 'Jaipur Forts', 'Kurukshetra'],
            engine: 'Rule-based Recovery'
          });
        }
      } catch {
        setError({
          headline: `No tourist spots found for "${destinationName || currentQuery}"`,
          explanation: `We couldn't discover verified tourist attractions matching this criteria.`,
          suggestion: 'Try checking the spelling, selecting "All Attractions", or searching for a major landmark.',
          sampleQueries: ['Kyoto Temples', 'Jaipur Forts', 'Kurukshetra'],
          engine: 'Rule-based Recovery'
        });
      }
    }

    if (weatherData) {
      setWeather(weatherData);
    }

    setLoading(false);

    // Notify hyperDart platform that UI is ready (only required once)
    if (!hasNotifiedLoadedRef.current) {
      props?.messageHandlers?.componentLoaded?.();
      hasNotifiedLoadedRef.current = true;
    }
  }, [API_URL, coords.lat, coords.lon, activeCategory, searchRadius, destinationName, specificPlace, props.messageHandlers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle dynamic NLP search for any world location
  const handleUserSearch = async (newQuery) => {
    if (!newQuery || !newQuery.trim()) return;
    const cleanQuery = newQuery.trim();
    setCurrentQuery(cleanQuery);
    const searchId = ++searchIdRef.current;

    // Immediately show loading and clear stale attractions/errors
    setLoading(true);
    setError(null);
    setAttractions([]);
    setSelectedAttraction(null);
    setWeather(null);

    const { category, locationText } = extractSearchIntent(cleanQuery);

    // Call dynamic Geocoding API (Groq LLM + Geoapify + Nominatim OSM backend)
    let geocoded = null;
    try {
      const res = await fetch(`${API_URL}/api/geocode?query=${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        geocoded = await res.json();
      } else if (res.status === 404) {
        geocoded = await res.json();
      }
    } catch (e) {
      console.warn('Backend geocode unavailable, trying client-side geocoding:', e);
    }

    // Direct Nominatim geocoding fallback if backend is offline or did not resolve
    if ((!geocoded || (geocoded.lat == null && !geocoded.errorInsight)) && locationText) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationText
        )}&format=json&limit=1`;
        const nomRes = await fetch(nomUrl, {
          headers: { 'User-Agent': 'TourismExplorerHyperDart/1.0' },
          signal: AbortSignal.timeout(3500)
        });
        if (nomRes.ok) {
          const data = await nomRes.json();
          if (data && data[0]) {
            geocoded = {
              destination: data[0].display_name?.split(',')?.[0] || locationText,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
              category
            };
          }
        }
      } catch (err) {
        console.warn('Client geocoding fallback error:', err);
      }
    }

    // Drop stale async responses if user submitted a newer search
    if (searchId !== searchIdRef.current) return;

    if (geocoded && geocoded.lat != null && geocoded.lon != null) {
      setDestinationName(geocoded.destination || locationText);
      setSpecificPlace(geocoded.specificPlace || null);
      setActiveCategory(geocoded.category || category || 'all');
      setError(null);
      // Coords change will cleanly invoke fetchData
      setCoords({ lat: geocoded.lat, lon: geocoded.lon });
    } else {
      // Unresolved or invalid location: clear coordinates and destination completely
      setCoords({ lat: null, lon: null });
      setDestinationName(locationText || cleanQuery);
      setSpecificPlace(null);
      setAttractions([]);
      setSelectedAttraction(null);
      setLoading(false);

      if (geocoded && geocoded.errorInsight) {
        setError(geocoded.errorInsight);
      } else {
        // Fetch meaningful error insight from Groq
        try {
          const insightRes = await fetch(`${API_URL}/api/error-insight`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: cleanQuery,
              category: category || 'all',
              destination: locationText || cleanQuery,
              errorCode: 'LOCATION_NOT_FOUND'
            })
          });
          if (insightRes.ok) {
            const insightData = await insightRes.json();
            if (searchId === searchIdRef.current) {
              setError(insightData);
            }
          } else {
            if (searchId === searchIdRef.current) {
              setError({
                headline: `Could not locate "${locationText || cleanQuery}"`,
                explanation: `We were unable to resolve geographical coordinates for "${locationText || cleanQuery}". This might be a typo, misspelling, or unrecognized place.`,
                suggestion: 'Try checking the spelling, or search for a major city, country, or famous landmark.',
                sampleQueries: ['Kyoto Temples', 'Jaipur Forts', 'Kurukshetra', 'Paris, France'],
                engine: 'Rule-based Recovery'
              });
            }
          }
        } catch {
          if (searchId === searchIdRef.current) {
            setError({
              headline: `Could not locate "${locationText || cleanQuery}"`,
              explanation: `We were unable to resolve geographical coordinates for "${locationText || cleanQuery}".`,
              suggestion: 'Try checking the spelling, or search for a major city, country, or famous landmark.',
              sampleQueries: ['Kyoto Temples', 'Jaipur Forts', 'Kurukshetra', 'Paris, France'],
              engine: 'Rule-based Recovery'
            });
          }
        }
      }
    }
  };

  // Compute category counts for chips
  const categoryCounts = useMemo(() => {
    const counts = { all: attractions.length };
    attractions.forEach((a) => {
      const g = a.categoryGroup || 'sights';
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [attractions]);

  const isSidebar = format === 'sidebar';

  return (
    <div
      ref={containerRef}
      className={`tourism-explorer-wrapper ${isDark ? 'hd-dark-theme' : ''}`}
      style={{
        paddingBottom: '32px'
      }}
    >
      {/* Brand Navigation Header */}
      <BrandHeader
        destinationName={destinationName}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        format={format}
        onToggleFormat={() => setFormat(format === 'sidebar' ? 'mainline' : 'sidebar')}
        onOpenPlanner={() => setIsPlannerOpen(true)}
        attractionsCount={attractions.length}
      />

      {/* Main Content Area */}
      <main
        style={{
          maxWidth: isSidebar ? '100%' : '1280px',
          margin: '0 auto',
          padding: isSidebar ? '14px 16px' : '20px 24px'
        }}
      >
        {/* Search Bar with Preset Query Shortcuts */}
        <SearchBar initialQuery={currentQuery} onSearch={handleUserSearch} format={format} />

        {/* Category Filters */}
        <CategoryFilters
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          categoryCounts={categoryCounts}
        />

        {/* Weather Preview Banner */}
        <WeatherWidget weather={weather} destinationName={destinationName} format={format} />

        {/* Layout: Sidebar vs Mainline 2-column */}
        {isSidebar ? (
          /* NARROW SIDEBAR VIEW: Stacked vertical */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Map preview */}
            <MapPanel
              attractions={attractions}
              selectedAttraction={selectedAttraction}
              onSelectAttraction={(att) => setSelectedAttraction(att)}
              destLat={coords.lat}
              destLon={coords.lon}
              destinationName={destinationName}
              format="sidebar"
              isCollapsed={isMapCollapsed}
              onToggleCollapse={() => setIsMapCollapsed(!isMapCollapsed)}
            />

            {/* Attractions Content */}
            {loading ? (
              <LoadingSkeleton format="sidebar" />
            ) : error ? (
              <ErrorState
                error={error}
                onRetry={() => handleUserSearch(currentQuery)}
                onSelectQuery={handleUserSearch}
                onResetCategory={() => setActiveCategory('all')}
                category={activeCategory}
                format="sidebar"
              />
            ) : attractions.length === 0 ? (
              <EmptyState
                destinationName={destinationName}
                category={activeCategory}
                onResetCategory={() => setActiveCategory('all')}
                onExpandRadius={() => setSearchRadius((r) => r + 8000)}
                format="sidebar"
              />
            ) : (
              <AttractionGrid
                attractions={attractions}
                selectedAttraction={selectedAttraction}
                onSelectAttraction={(att) => setSelectedAttraction(att)}
                onOpenDetails={(att) => setDetailAttraction(att)}
                onShowOnMap={(att) => {
                  setSelectedAttraction(att);
                  setIsMapCollapsed(false);
                }}
                format="sidebar"
                destinationName={destinationName}
                category={activeCategory}
              />
            )}
          </div>
        ) : (
          /* MAINLINE VIEW: Spacious 2-Column Desktop Layout */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Sights Discovery */}
            <div>
              {loading ? (
                <LoadingSkeleton format="mainline" />
              ) : error ? (
                <ErrorState
                  error={error}
                  onRetry={() => handleUserSearch(currentQuery)}
                  onSelectQuery={handleUserSearch}
                  onResetCategory={() => setActiveCategory('all')}
                  category={activeCategory}
                  format="mainline"
                />
              ) : attractions.length === 0 ? (
                <EmptyState
                  destinationName={destinationName}
                  category={activeCategory}
                  onResetCategory={() => setActiveCategory('all')}
                  onExpandRadius={() => setSearchRadius((r) => r + 8000)}
                  format="mainline"
                />
              ) : (
                <AttractionGrid
                  attractions={attractions}
                  selectedAttraction={selectedAttraction}
                  onSelectAttraction={(att) => setSelectedAttraction(att)}
                  onOpenDetails={(att) => setDetailAttraction(att)}
                  onShowOnMap={(att) => setSelectedAttraction(att)}
                  format="mainline"
                  destinationName={destinationName}
                  category={activeCategory}
                />
              )}
            </div>

            {/* Right Column: Geographic Context & Interactive Map */}
            <div style={{ position: 'sticky', top: '20px' }}>
              <MapPanel
                attractions={attractions}
                selectedAttraction={selectedAttraction}
                onSelectAttraction={(att) => setSelectedAttraction(att)}
                destLat={coords.lat}
                destLon={coords.lon}
                destinationName={destinationName}
                format="mainline"
                isCollapsed={false}
              />

              {/* Day Plan Prompt Card */}
              {attractions.length > 0 && (
                <div
                  className="tourism-card"
                  style={{
                    padding: '16px 20px',
                    background: 'var(--brand-gradient)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                      Ready to explore {destinationName}?
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                      Generate an optimized morning-to-evening route with minimal travel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlannerOpen(true)}
                    style={{
                      background: '#ffffff',
                      color: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    Build Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Expanded Attraction Detail Drawer/Modal */}
      {detailAttraction && (
        <AttractionDetailModal
          attraction={detailAttraction}
          onClose={() => setDetailAttraction(null)}
        />
      )}

      {/* AI Day Planner Modal */}
      <DayPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        destinationName={destinationName}
        attractions={attractions}
        apiUrl={API_URL}
        onSelectAttraction={(att) => {
          setSelectedAttraction(att);
          setIsPlannerOpen(false);
        }}
      />
    </div>
  );
}
