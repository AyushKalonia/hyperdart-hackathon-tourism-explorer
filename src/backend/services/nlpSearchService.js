/**
 * Groq LLM Travel NLP Search Service
 * Uses Groq fast inference (Qwen 27B / GPT-OSS 20B) to understand arbitrary user travel queries,
 * extract destination entities, category filters, and intent.
 */

export async function parseQueryWithGroq(queryText, groqApiKey) {
  if (!queryText || !groqApiKey || groqApiKey === 'YOUR_GROQ_API_KEY') {
    return null;
  }

  const clean = queryText.trim();
  if (clean.length < 2) return null;

  try {
    const systemPrompt = `You are an expert travel NLP parser for a global tourism explorer.
Given a user's natural language search query, extract the travel intent into a valid JSON object:
- "destination": The target city, region, town, or area (e.g. "Agra", "Kyoto", "Jaipur", "Paris", "Kurukshetra", "New York", "Rome", "Tokyo", "London", "Bali"). Never include words like 'best' or 'places' or 'visit' in destination. If the query is gibberish, random text, or not a real geographic place, set destination to null and specificPlace to null.
- "specificPlace": If the user specifically mentions or searches for a distinct attraction/monument/site (e.g. "Taj Mahal", "Eiffel Tower", "Amber Fort", "Brahma Sarovar", "Colosseum", "Louvre Museum", "Kiyomizu-dera"), extract its proper clean name. Otherwise set to null.
- "country": Country name if identifiable, otherwise "".
- "category": Strictly one of: ["museums", "temples", "forts", "monuments", "parks", "landmarks", "historic", "all"].
- "searchKeywords": Array of 1-3 specific place descriptors (e.g. ["palace", "fort"]).
- "searchRadiusMeters": Recommended integer radius (3000 to 20000).

Return ONLY the raw JSON object, no explanation or markdown fences.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: clean }
        ]
      }),
      signal: AbortSignal.timeout(3500)
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.destination || parsed.specificPlace) {
          return {
            destination: (parsed.destination || parsed.specificPlace || '').trim(),
            specificPlace: parsed.specificPlace ? parsed.specificPlace.trim() : null,
            country: parsed.country || '',
            category: parsed.category || 'all',
            searchKeywords: parsed.searchKeywords || [],
            searchRadiusMeters: parsed.searchRadiusMeters || 8000,
            engine: 'Groq LLM (Qwen-27B)'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Groq NLP parsing failed, using rule-based fallback:', err.message);
  }

  return null;
}
