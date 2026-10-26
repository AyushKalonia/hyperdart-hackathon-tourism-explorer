import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node';
import { env } from 'cloudflare:workers';
import 'dotenv/config';

import { getAttractions } from './services/geoapifyService.js';
import { generateItinerary } from './services/itineraryService.js';
import { getWeather } from './services/weatherService.js';
import { parseQueryWithGroq } from './services/nlpSearchService.js';
import { generateErrorInsight } from './services/errorInsightService.js';
import { CURATED_PLACES, getCuratedCityData } from './data/curatedPlaces.js';

// Create Express app
const app = express();

// Middleware: JSON body parsing
app.use(express.json());

// Helper to safely retrieve environment variables across Workers and Node.js
const getEnvVar = (key) => {
  try {
    if (typeof env !== 'undefined' && env && env[key]) return env[key];
  } catch {}
  return process.env[key] || '';
};

const devDomain = getEnvVar('DEV_DOMAIN');
const stagingDomain = getEnvVar('STAGING_DOMAIN');
const prodDomain = getEnvVar('PROD_DOMAIN');

// Middleware: CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  devDomain,
  stagingDomain,
  prodDomain
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.hyperdart.com')) {
        callback(null, true);
      } else {
        // Allow all local dev connections gracefully
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev/sandbox to prevent blocking
        }
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// Placeholder for DB access (Cloudflare D1)
const getDB = () => {
  try {
    return env.DB;
  } catch {
    return null;
  }
};

// Route: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Tourism Explorer Backend',
    timestamp: new Date().toISOString()
  });
});

// Route: Basic Test (Template requirement)
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Tourism Explorer Backend!' });
});

// Route: Dynamic Hello (Template requirement)
app.get('/api/hello/:name', (req, res) => {
  const environment = getEnvVar('ENVIRONMENT') || 'development';
  res.json({ message: `Hello, ${req.params.name} (${environment})` });
});

// Route: Dynamic Geocoding & NLP Location Extractor
// GET /api/geocode?query=...
app.get('/api/geocode', async (req, res) => {
  try {
    const rawQuery = (req.query.query || '').trim();
    if (!rawQuery) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const groqKey = getEnvVar('GROQ_API_KEY');
    let nlpEngine = 'Rule-based NLP Engine';
    let groqParsed = null;

    if (groqKey) {
      groqParsed = await parseQueryWithGroq(rawQuery, groqKey);
    }

    let category = 'all';
    let locationText = '';
    let specificPlace = null;

    if (groqParsed && (groqParsed.destination || groqParsed.specificPlace)) {
      locationText = groqParsed.destination || groqParsed.specificPlace;
      specificPlace = groqParsed.specificPlace || null;
      category = groqParsed.category || 'all';
      nlpEngine = groqParsed.engine || 'Groq LLM (Qwen-27B)';
    } else {
      // Rule-based NLP category extraction
      const qLower = rawQuery.toLowerCase();
      if (qLower.includes('museum')) category = 'museums';
      else if (qLower.includes('temple') || qLower.includes('shrine') || qLower.includes('church') || qLower.includes('mosque')) category = 'temples';
      else if (qLower.includes('fort') || qLower.includes('castle')) category = 'forts';
      else if (qLower.includes('monument')) category = 'monuments';
      else if (qLower.includes('park') || qLower.includes('garden')) category = 'parks';
      else if (qLower.includes('landmark')) category = 'landmarks';
      else if (qLower.includes('viewpoint') || qLower.includes('skyline')) category = 'viewpoints';
      else if (qLower.includes('historic') || qLower.includes('heritage') || qLower.includes('ancient')) category = 'historic';

      // Rule-based location text cleaning
      locationText = rawQuery.trim();
      locationText = locationText.replace(/^(what\s+to\s+(see|do|visit)|where\s+to\s+go|how\s+to\s+see)\s+(in|near|around|at)\s+/i, '');
      locationText = locationText.replace(/^(visit|explore|travel\s+to|show\s+me|find|see)\s+/i, '');
      locationText = locationText.replace(/^(best|top|famous|popular|all|great|cool|cheap|free|historical|historic)\s+/i, '');
      locationText = locationText.replace(/(places\s+to\s+(visit|see)|things\s+to\s+do|tourist\s+attractions?|points\s+of\s+interest|sights|monuments|museums|temples|forts|parks|landmarks|activities|waterfalls|places)\s+(in|near|around|at|of)\s+/i, '');
      locationText = locationText.replace(/(\s+(attractions|tourism|sights|places|guide|spots|highlights))$/i, '');

      const matchPrep = locationText.match(/(?:in|near|around|at)\s+([A-Za-z\s,.-]+)$/i);
      if (matchPrep && matchPrep[1]) {
        locationText = matchPrep[1].trim();
      }

      locationText = locationText.replace(/^[,\s]+|[,\s?]+$/g, '').trim() || rawQuery.trim();
    }

    // 3. Check curated benchmark cities first
    const curatedMatch = getCuratedCityData(locationText, null, null);
    if (curatedMatch) {
      return res.json({
        success: true,
        source: 'Curated Benchmark',
        query: rawQuery,
        destination: curatedMatch.destination,
        specificPlace: specificPlace,
        formattedAddress: `${curatedMatch.destination}`,
        lat: curatedMatch.lat,
        lon: curatedMatch.lon,
        category,
        engine: nlpEngine
      });
    }

    const apiKey = getEnvVar('GEOAPIFY_API_KEY');

    // 4. Try Geoapify Geocoding API (search for specific place first if identified)
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEOAPIFY_API_KEY') {
      try {
        const searchText = specificPlace
          ? `${specificPlace}, ${locationText}`
          : locationText;

        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchText
        )}&apiKey=${apiKey}`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(4500) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const first = geoData.features?.[0];
          if (first && first.properties) {
            const props = first.properties;
            const destName = props.city || props.name || props.formatted?.split(',')?.[0] || locationText;
            return res.json({
              success: true,
              source: 'Geoapify Geocoder',
              query: rawQuery,
              destination: destName,
              specificPlace: specificPlace,
              formattedAddress: props.formatted || destName,
              lat: props.lat,
              lon: props.lon,
              category,
              engine: nlpEngine
            });
          }
        }
      } catch (e) {
        console.warn('Geoapify geocode error:', e.message);
      }
    }

    // 5. Fallback to OpenStreetMap Nominatim
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        specificPlace ? `${specificPlace}, ${locationText}` : locationText
      )}&format=json&limit=1`;
      const nomRes = await fetch(nomUrl, {
        headers: { 'User-Agent': 'TourismExplorerHyperDart/1.0 (info@tourismexplorer.org)' },
        signal: AbortSignal.timeout(4000)
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData && nomData.length > 0) {
          const place = nomData[0];
          const destName = place.display_name?.split(',')?.[0] || locationText;
          return res.json({
            success: true,
            source: 'Nominatim OSM',
            query: rawQuery,
            destination: destName,
            specificPlace: specificPlace,
            formattedAddress: place.display_name || destName,
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon),
            category,
            engine: nlpEngine
          });
        }
      }
    } catch (e) {
      console.warn('Nominatim fallback error:', e.message);
    }

    const errorInsight = await generateErrorInsight({
      query: rawQuery,
      category,
      destination: locationText,
      errorCode: 'LOCATION_NOT_FOUND',
      originalError: `Could not determine geographic coordinates for "${locationText}".`,
      groqApiKey: groqKey
    });

    return res.status(404).json({
      error: 'Location not found',
      message: `Could not determine geographic coordinates for "${locationText}".`,
      errorInsight
    });
  } catch (err) {
    console.error('Geocode route error:', err);
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

// Route: Groq AI Error Insight Generator
// POST /api/error-insight
app.post('/api/error-insight', async (req, res) => {
  try {
    const { query = '', category = 'all', destination = '', errorCode = 'GENERAL_ERROR', error = '' } = req.body || {};
    const groqKey = getEnvVar('GROQ_API_KEY');
    const insight = await generateErrorInsight({
      query,
      category,
      destination,
      errorCode,
      originalError: error,
      groqApiKey: groqKey
    });
    res.json({ success: true, ...insight });
  } catch (e) {
    res.json({
      success: false,
      headline: 'Unable to discover attractions',
      explanation: 'We encountered a connection or location lookup issue while searching for attractions.',
      suggestion: 'Try checking the spelling or searching for a popular city.',
      sampleQueries: ['Kyoto Temples', 'Jaipur Forts', 'Kurukshetra']
    });
  }
});

// Route: Main Attractions Search
// GET /api/attractions?lat=...&lon=...&category=...&radius=...&query=...&destination=...&specificPlace=...
app.get('/api/attractions', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const category = req.query.category || 'all';
    const radius = parseInt(req.query.radius, 10) || 8000;
    const limit = parseInt(req.query.limit, 10) || 20;
    const query = req.query.query || '';
    const destination = req.query.destination || '';
    const specificPlace = req.query.specificPlace || '';

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'Parameters lat and lon must be valid numbers.'
      });
    }

    const apiKey = getEnvVar('GEOAPIFY_API_KEY');

    const result = await getAttractions({
      lat,
      lon,
      category,
      radius,
      limit,
      query,
      destination,
      specificPlace,
      apiKey
    });

    res.json({
      success: true,
      query,
      destination: destination || result.destination,
      specificPlace,
      coordinates: { lat, lon },
      category: result.category,
      radius: result.radius,
      count: result.count,
      source: result.source,
      attractions: result.attractions
    });
  } catch (err) {
    console.error('Error fetching attractions:', err);
    res.status(500).json({
      error: 'Failed to retrieve attractions',
      details: err.message
    });
  }
});


// Route: Attraction Details Lookup
// GET /api/attractions/:id
app.get('/api/attractions/:id', (req, res) => {
  const { id } = req.params;
  
  // Search across curated places first
  for (const city of Object.values(CURATED_PLACES)) {
    const found = city.attractions.find((a) => a.id === id);
    if (found) {
      return res.json({ success: true, attraction: found });
    }
  }

  res.status(404).json({
    error: 'Attraction not found',
    message: `No details found for ID ${id}`
  });
});

// Route: AI-Assisted Day Plan
// POST /api/itinerary
app.post('/api/itinerary', async (req, res) => {
  try {
    const { destination, attractions, preferences, durationHours } = req.body;

    if (!Array.isArray(attractions) || attractions.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'attractions array must contain at least 1 place.'
      });
    }

    const groqApiKey = getEnvVar('GROQ_API_KEY');

    const itinerary = await generateItinerary({
      destination: destination || 'Selected City',
      attractions,
      preferences: preferences || 'balanced sightseeing',
      durationHours: durationHours || 8,
      groqApiKey
    });

    res.json({
      success: true,
      ...itinerary
    });
  } catch (err) {
    console.error('Error generating itinerary:', err);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      details: err.message
    });
  }
});

// Route: Destination Weather
// GET /api/weather?lat=...&lon=...
app.get('/api/weather', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'Parameters lat and lon must be valid numbers.'
      });
    }

    const weather = await getWeather(lat, lon);
    res.json({
      success: true,
      weather
    });
  } catch (err) {
    console.error('Error fetching weather:', err);
    res.status(500).json({
      error: 'Failed to fetch weather',
      details: err.message
    });
  }
});

app.listen(3000);
export default httpServerHandler({ port: 3000 });
