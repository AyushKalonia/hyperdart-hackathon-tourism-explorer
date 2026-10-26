/**
 * Wikipedia API Service for enriching attractions with real descriptions and authentic photos.
 * Uses Wikipedia's public Action API with fuzzy search generator for maximum accuracy across any world location.
 */

const WIKI_CACHE = new Map();

export async function fetchWikiInfo(placeName, destinationHint = '') {
  if (!placeName) return null;
  const cleanName = placeName.trim().replace(/\s+/g, ' ');
  const cacheKey = `${cleanName}__${destinationHint}`.toLowerCase();
  
  if (WIKI_CACHE.has(cacheKey)) {
    return WIKI_CACHE.get(cacheKey);
  }

  // 1. Try search with placeName + destinationHint
  const searchQuery = destinationHint && !cleanName.toLowerCase().includes(destinationHint.toLowerCase())
    ? `${cleanName} ${destinationHint}`
    : cleanName;

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      searchQuery
    )}&gsrlimit=1&prop=pageimages|extracts&exintro&explaintext&exchars=280&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'TourismExplorerHyperDart/1.0 (info@tourismexplorer.org)' },
      signal: AbortSignal.timeout(3500)
    });

    if (response.ok) {
      const data = await response.json();
      const pages = data?.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        if (page && page.pageid && page.pageid > 0) {
          const result = {
            title: page.title || null,
            description: page.extract || null,
            imageUrl: page.thumbnail?.source || null
          };

          if (result.description || result.imageUrl) {
            WIKI_CACHE.set(cacheKey, result);
            return result;
          }
        }
      }
    }
  } catch {
    // Continue to direct title fallback
  }

  // 2. Direct title match fallback
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&exchars=280&piprop=thumbnail&pithumbsize=960&titles=${encodeURIComponent(
      cleanName
    )}&format=json&origin=*`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'TourismExplorerHyperDart/1.0 (info@tourismexplorer.org)' },
      signal: AbortSignal.timeout(3000)
    });

    if (response.ok) {
      const data = await response.json();
      const pages = data?.query?.pages;
      if (pages) {
        const firstPageId = Object.keys(pages)[0];
        if (firstPageId !== '-1') {
          const page = pages[firstPageId];
          const result = {
            title: page.title || null,
            description: page.extract || null,
            imageUrl: page.thumbnail?.source || null
          };
          WIKI_CACHE.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch {
    // Fail silently
  }

  return null;
}
