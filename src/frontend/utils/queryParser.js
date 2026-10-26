/**
 * Query and Entity Parser for hyperDart Tourism Explorer
 * Handles both single object and array formats of searchData prop.
 * Extracts destination coordinates from HD_LOCATION entity while respecting query intent.
 */

export function parseSearchPayload(searchData, searchQuery = '') {
  // 1. Normalize input: searchData may arrive as an array or a single object
  let primaryItem = null;
  if (Array.isArray(searchData)) {
    primaryItem = searchData[0] || null;
  } else if (searchData && typeof searchData === 'object') {
    primaryItem = searchData;
  }

  const rawQuery = primaryItem?.query || searchQuery || 'Tourist attractions in NYC';

  // 2. Extract Location Entity
  let destinationName = '';
  let destLat = null;
  let destLon = null;
  let country = '';

  const entities = Array.isArray(primaryItem?.entities) ? primaryItem.entities : [];

  // Look for HD_LOCATION or LOCATION entity
  const locationEntity = entities.find(
    (e) =>
      e.collectionType === 'HD_LOCATION' ||
      e.entityType === 'LOCATION' ||
      e.collectionName === 'CITIES' ||
      e.collectionName === 'COUNTRIES'
  );

  if (locationEntity) {
    destinationName = locationEntity.entityInfo?.geo?.city || locationEntity.word || '';
    destLat = locationEntity.entityInfo?.geo?.lat ?? null;
    destLon = locationEntity.entityInfo?.geo?.long ?? null;
    country = locationEntity.entityInfo?.geo?.country || '';
  }

  // 3. Fallback extraction from query text if coordinates missing
  if (destLat == null || destLon == null) {
    const queryLower = rawQuery.toLowerCase();
    if (queryLower.includes('kurukshetra')) {
      destinationName = destinationName || 'Kurukshetra';
      destLat = 29.9695;
      destLon = 76.8783;
    } else if (queryLower.includes('nyc') || queryLower.includes('new york')) {
      destinationName = destinationName || 'New York City';
      destLat = 40.71427;
      destLon = -74.00597;
    } else if (queryLower.includes('paris')) {
      destinationName = destinationName || 'Paris';
      destLat = 48.8566;
      destLon = 2.3522;
    } else if (queryLower.includes('rome')) {
      destinationName = destinationName || 'Rome';
      destLat = 41.9028;
      destLon = 12.4964;
    } else if (queryLower.includes('delhi')) {
      destinationName = destinationName || 'Delhi';
      destLat = 28.6139;
      destLon = 77.2090;
    } else if (queryLower.includes('varanasi') || queryLower.includes('banaras') || queryLower.includes('kashi')) {
      destinationName = destinationName || 'Varanasi';
      destLat = 25.3176;
      destLon = 82.9739;
    } else if (queryLower.includes('tokyo')) {
      destinationName = destinationName || 'Tokyo';
      destLat = 35.6762;
      destLon = 139.6503;
    } else if (queryLower.includes('jaipur')) {
      destinationName = destinationName || 'Jaipur';
      destLat = 26.9124;
      destLon = 75.7873;
    } else if (queryLower.includes('london')) {
      destinationName = destinationName || 'London';
      destLat = 51.5074;
      destLon = -0.1278;
    } else {
      // General default if unresolved
      destinationName = destinationName || 'Explore Destination';
      destLat = 40.71427;
      destLon = -74.00597;
    }
  }

  // 4. Resolve Category Intent from Query
  const q = rawQuery.toLowerCase();
  let requestedCategory = 'all';

  if (q.includes('museum')) {
    requestedCategory = 'museums';
  } else if (q.includes('temple') || q.includes('shrine') || q.includes('church') || q.includes('mosque')) {
    requestedCategory = 'temples';
  } else if (q.includes('monument')) {
    requestedCategory = 'monuments';
  } else if (q.includes('fort') || q.includes('castle')) {
    requestedCategory = 'forts';
  } else if (q.includes('landmark')) {
    requestedCategory = 'landmarks';
  } else if (q.includes('park') || q.includes('garden')) {
    requestedCategory = 'parks';
  } else if (q.includes('viewpoint') || q.includes('view') || q.includes('skyline')) {
    requestedCategory = 'viewpoints';
  } else if (q.includes('historic') || q.includes('heritage') || q.includes('ancient')) {
    requestedCategory = 'historic';
  } else if (q.includes('sight') || q.includes('attraction') || q.includes('things to do') || q.includes('places to visit')) {
    requestedCategory = 'all';
  }

  // User location (if present in payload)
  const userCoords = primaryItem?.userLocation?.position?.coords || null;

  return {
    rawQuery,
    destinationName: destinationName || 'Selected Destination',
    destLat,
    destLon,
    country,
    requestedCategory,
    userCoords,
    suggestedPlace: primaryItem?.suggestedPlace || 'mainline'
  };
}

/**
 * NLP Intent & Destination Extractor
 * Extracts category intent and target location from arbitrary natural language queries.
 */
export function extractSearchIntent(rawQuery = '') {
  const qLower = (rawQuery || '').toLowerCase().trim();
  let category = 'all';

  if (qLower.includes('museum')) category = 'museums';
  else if (qLower.includes('temple') || qLower.includes('shrine') || qLower.includes('church') || qLower.includes('mosque')) category = 'temples';
  else if (qLower.includes('fort') || qLower.includes('castle')) category = 'forts';
  else if (qLower.includes('monument')) category = 'monuments';
  else if (qLower.includes('park') || qLower.includes('garden')) category = 'parks';
  else if (qLower.includes('landmark')) category = 'landmarks';
  else if (qLower.includes('viewpoint') || qLower.includes('view') || qLower.includes('skyline')) category = 'viewpoints';
  else if (qLower.includes('historic') || qLower.includes('heritage') || qLower.includes('ancient')) category = 'historic';

  let locationText = (rawQuery || '').trim();
  // Strip leading question/intent phrases
  locationText = locationText.replace(/^(what\s+to\s+(see|do|visit)|where\s+to\s+go|how\s+to\s+see)\s+(in|near|around|at)\s+/i, '');
  locationText = locationText.replace(/^(visit|explore|travel\s+to|show\s+me|find|see)\s+/i, '');
  locationText = locationText.replace(/^(best|top|famous|popular|all|great|cool|cheap|free|historical|historic)\s+/i, '');
  locationText = locationText.replace(/(places\s+to\s+(visit|see)|things\s+to\s+do|tourist\s+attractions?|points\s+of\s+interest|sights|monuments|museums|temples|forts|parks|landmarks|activities|waterfalls)\s+(in|near|around|at|of)\s+/i, '');
  locationText = locationText.replace(/(\s+(attractions|tourism|sights|places|guide|spots|highlights))$/i, '');

  // If phrase still contains ' in <loc>' or ' near <loc>'
  const matchPrep = locationText.match(/(?:in|near|around|at)\s+([A-Za-z\s,.-]+)$/i);
  if (matchPrep && matchPrep[1]) {
    locationText = matchPrep[1].trim();
  }

  // Clean trailing punctuation and whitespace
  locationText = locationText.replace(/^[,\s]+|[,\s?]+$/g, '').trim() || rawQuery.trim();

  return { category, locationText };
}

