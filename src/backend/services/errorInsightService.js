/**
 * Groq AI Error Insight Service
 * Converts raw API failures, unfindable locations, or empty tourism results into
 * meaningful, friendly, and actionable explanations with clickable destination suggestions.
 */

export async function generateErrorInsight({
  query = '',
  category = 'all',
  destination = '',
  errorCode = 'UNKNOWN_ERROR',
  originalError = '',
  groqApiKey = ''
}) {
  const cleanQuery = (query || destination || '').trim();

  // Rule-based fallback template
  const defaultFallback = {
    headline: cleanQuery ? `No tourist sights found for "${cleanQuery}"` : 'Unable to load attractions',
    explanation: cleanQuery
      ? `We couldn't discover verified tourist attractions matching "${cleanQuery}". The place may have a typo, be an unmapped location, or not have public tourism landmarks recorded.`
      : 'We ran into a temporary issue retrieving destination attractions.',
    suggestion: 'Try checking the spelling, searching for a nearby major city, or exploring popular heritage destinations below.',
    sampleQueries: ['Kyoto Temples', 'Jaipur Forts', 'Kurukshetra', 'New York City', 'Paris'],
    engine: 'Rule-based Recovery'
  };

  if (!groqApiKey || groqApiKey === 'YOUR_GROQ_API_KEY') {
    return defaultFallback;
  }

  try {
    const systemPrompt = `You are an empathetic, highly knowledgeable AI travel assistant helping a user when their tourism search fails or has an error.
Given the user's search query, the selected category, and failure reason, produce a constructive and friendly JSON explanation:
- "headline": Short, friendly title (max 7 words). Mention the query or issue naturally.
- "explanation": 1-2 clear, compassionate sentences explaining why this search did not yield attractions (e.g. unrecognizable name, mismatch between category and geography like scuba diving in mountains, or remote location).
- "suggestion": 1 practical recommendation on how to search better.
- "sampleQueries": Array of exactly 3 realistic, famous travel destinations or landmarks the user could click to explore instead (e.g. ["Kyoto, Japan", "Jaipur, India", "Eiffel Tower, Paris"]).

Return ONLY a valid JSON object without markdown fences or code blocks.`;

    const userPayload = JSON.stringify({
      userQuery: cleanQuery,
      category: category,
      destinationName: destination,
      errorReason: originalError || errorCode
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPayload }
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
        if (parsed.headline && parsed.explanation) {
          return {
            headline: parsed.headline.trim(),
            explanation: parsed.explanation.trim(),
            suggestion: parsed.suggestion ? parsed.suggestion.trim() : defaultFallback.suggestion,
            sampleQueries: Array.isArray(parsed.sampleQueries) && parsed.sampleQueries.length > 0
              ? parsed.sampleQueries.slice(0, 3)
              : defaultFallback.sampleQueries,
            engine: 'Groq AI Intelligence'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Groq error insight generation failed, using fallback:', err.message);
  }

  return defaultFallback;
}
