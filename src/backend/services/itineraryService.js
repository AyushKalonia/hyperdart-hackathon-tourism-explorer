/**
 * AI & Heuristic Itinerary Planner Service
 * Organizes tourist attractions geographically into a practical day plan.
 * Uses Groq LLM API if key is present, with deterministic nearest-neighbor TSP fallback.
 */

import { calculateDistance } from './geoapifyService.js';

/**
 * Heuristic nearest-neighbor tour builder
 */
function buildHeuristicItinerary(destination, attractions, durationHours = 8) {
  if (!attractions || attractions.length === 0) {
    return {
      destination: destination || 'Selected City',
      totalPlaces: 0,
      itinerary: [],
      summary: 'No attractions selected to plan an itinerary.',
      estimatedTotalTravelTime: '0 mins'
    };
  }

  // Copy places to avoid mutating
  const remaining = [...attractions];
  const ordered = [];
  let current = remaining.shift();
  ordered.push(current);

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dist = calculateDistance(current.lat, current.lon, remaining[i].lat, remaining[i].lon);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    current = remaining.splice(nearestIdx, 1)[0];
    ordered.push(current);
  }

  // Assign time slots
  const slots = [
    { title: 'Morning (09:00 - 11:30)', period: 'morning', tip: 'Beat the morning rush; pleasant natural lighting for sightseeing and photos.' },
    { title: 'Midday (11:45 - 14:00)', period: 'midday', tip: 'Ideal time for exploration, followed by a relaxing lunch break nearby.' },
    { title: 'Afternoon (14:30 - 17:00)', period: 'afternoon', tip: 'Great afternoon window to discover deeper exhibits and architectural details.' },
    { title: 'Golden Hour & Evening (17:15 - 19:30)', period: 'evening', tip: 'Enjoy scenic sunset ambience and evening illuminations.' }
  ];

  let totalTravelMinutes = 0;
  const itineraryItems = ordered.slice(0, 4).map((attraction, idx) => {
    const slot = slots[idx % slots.length];
    let travelLeg = '';
    if (idx > 0) {
      const prev = ordered[idx - 1];
      const dist = calculateDistance(prev.lat, prev.lon, attraction.lat, attraction.lon);
      const estMinutes = Math.max(8, Math.round(dist / 350)); // ~20 km/h city travel
      totalTravelMinutes += estMinutes;
      travelLeg = `~${(dist / 1000).toFixed(1)} km from ${prev.name} (${estMinutes} min travel)`;
    } else {
      travelLeg = 'Starting point for the day';
    }

    return {
      id: attraction.id,
      name: attraction.name,
      category: attraction.category,
      timeSlot: slot.title,
      duration: '1.5 - 2 hours',
      travelLeg: travelLeg,
      lat: attraction.lat,
      lon: attraction.lon,
      address: attraction.address,
      reason: `Geographically paired for smooth transit; visit ${attraction.name} to experience its renowned ${attraction.category.toLowerCase()}.`,
      insiderTip: slot.tip
    };
  });

  return {
    destination: destination || 'City Sightseeing',
    mode: 'Smart Spatial Route',
    totalPlaces: itineraryItems.length,
    estimatedTotalTravelTime: `~${totalTravelMinutes} mins between sights`,
    summary: `A balanced ${durationHours}-hour sightseeing day covering ${itineraryItems.length} top attractions ordered geographically to minimize transit time.`,
    itinerary: itineraryItems
  };
}

/**
 * AI-powered Day Plan using Groq API, with graceful heuristic fallback
 */
export async function generateItinerary({
  destination,
  attractions = [],
  preferences = 'balanced sightseeing',
  durationHours = 8,
  groqApiKey = ''
}) {
  if (!attractions || attractions.length === 0) {
    return {
      destination,
      totalPlaces: 0,
      itinerary: [],
      summary: 'Please provide attractions to generate an itinerary.'
    };
  }

  // If Groq key is available, call Groq LLM
  if (groqApiKey && groqApiKey.trim() !== '' && groqApiKey !== 'YOUR_GROQ_API_KEY') {
    try {
      const placesContext = attractions.slice(0, 6).map((a, i) => ({
        index: i + 1,
        id: a.id,
        name: a.name,
        category: a.category,
        lat: a.lat,
        lon: a.lon,
        address: a.address
      }));

      const systemPrompt = `You are an expert travel logistics companion for hyperDart.
Create an efficient day plan for ${destination || 'the destination'} tailored to the user's travel preferences.
STRICT RULES:
1. ONLY use places provided in the list. NEVER invent places or alter IDs.
2. Group nearby places logically to minimize transit.
3. Order attractions to match the chosen vibe:
   - For "Photography & Golden Hour": schedule the best scenic/outdoor spot during late afternoon/sunset.
   - For "Culture & Heritage": allocate ample time for museums and historical landmarks.
   - For "Family Friendly": balance activity with rest stops and accessible highlights.
   - For "Fast-Paced Explorer": cover more stops with energetic transitions.
4. Return valid JSON only, without markdown backticks or commentary.
Schema:
{
  "summary": "1-2 sentence overview capturing the theme and flow of the day",
  "estimatedTotalTravelTime": "e.g. ~45 mins",
  "itinerary": [
    {
      "id": "exact attraction id from input",
      "name": "exact place name",
      "timeSlot": "e.g. Morning (08:30 - 11:00)",
      "duration": "e.g. 2 hours",
      "travelLeg": "e.g. Starting point OR ~15 min transit from previous stop",
      "reason": "Why this place fits here in the sequence and matches preferences",
      "insiderTip": "Practical traveller tip (best viewing angle, crowd timing, or local advice)"
    }
  ]
}`;

      const userPrompt = `Destination: ${destination}
Available verified attractions:
${JSON.stringify(placesContext, null, 2)}
Preferences: ${preferences}
Duration: ${durationHours} hours`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0) {
            // Attach coordinates, photos and metadata back to parsed itinerary
            const enrichedItinerary = parsed.itinerary.map((item) => {
              const original = attractions.find((a) => a.id === item.id || a.name === item.name) || {};
              return {
                ...item,
                lat: original.lat,
                lon: original.lon,
                address: original.address,
                category: original.category,
                imageUrl: original.imageUrl || null,
                rating: original.rating || 4.7
              };
            });

            return {
              destination,
              mode: 'Groq AI Intelligence',
              model: 'qwen/qwen3.8-27b',
              preferences,
              totalPlaces: enrichedItinerary.length,
              summary: parsed.summary,
              estimatedTotalTravelTime: parsed.estimatedTotalTravelTime || '~40 mins',
              itinerary: enrichedItinerary
            };
          }
        }
      }
    } catch (err) {
      console.warn('Groq API call failed or timed out, using heuristic planner:', err.message);
    }
  }

  // Non-AI fallback: deterministic nearest-neighbor TSP planner
  return buildHeuristicItinerary(destination, attractions, durationHours);
}
