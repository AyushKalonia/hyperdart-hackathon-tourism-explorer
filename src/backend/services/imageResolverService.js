/**
 * Dynamic Attraction Image Resolver Service
 * Dynamically retrieves real, famous photographs of any tourist attraction
 * via Wikipedia PageImages & Wikimedia Commons APIs.
 */

const IMAGE_CACHE = new Map();

// High-quality category fallbacks with diverse photography so cards have unique aesthetics
const CATEGORY_FALLBACKS = {
  museums: [
    'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=900&auto=format&fit=crop&q=80'
  ],
  temples: [
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545232979-fbf68fe9f1f2?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&auto=format&fit=crop&q=80'
  ],
  forts: [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&auto=format&fit=crop&q=80'
  ],
  monuments: [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=900&auto=format&fit=crop&q=80'
  ],
  parks: [
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=900&auto=format&fit=crop&q=80'
  ],
  viewpoints: [
    'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80'
  ],
  historic: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80'
  ],
  sights: [
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&auto=format&fit=crop&q=80'
  ]
};

export async function resolveAttractionImage(placeName, cityHint = '', categoryGroup = 'sights') {
  if (!placeName) return null;
  const cleanName = placeName.trim().replace(/\s+/g, ' ');
  const cacheKey = `${cleanName}__${cityHint}`.toLowerCase();

  if (IMAGE_CACHE.has(cacheKey)) {
    return IMAGE_CACHE.get(cacheKey);
  }

  // 1. Wikipedia PageImages API (Search Generator for exact place)
  try {
    const q = cityHint && !cleanName.toLowerCase().includes(cityHint.toLowerCase())
      ? `${cleanName} ${cityHint}`
      : cleanName;

    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      q
    )}&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;

    const res = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'TourismExplorerHyperDart/1.0 (info@tourismexplorer.org)' },
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});
      // Sort by search relevance rank (index: 1 is top match)
      pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));

      for (const page of pages) {
        if (page?.thumbnail?.source) {
          IMAGE_CACHE.set(cacheKey, page.thumbnail.source);
          return page.thumbnail.source;
        }
      }
    }
  } catch {}

  // 2. Wikimedia Commons File Search API
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      cleanName
    )}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json&origin=*`;

    const res = await fetch(commonsUrl, {
      headers: { 'User-Agent': 'TourismExplorerHyperDart/1.0 (info@tourismexplorer.org)' },
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});
      pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));

      for (const page of pages) {
        const thumb = page?.imageinfo?.[0]?.thumburl;
        if (thumb) {
          IMAGE_CACHE.set(cacheKey, thumb);
          return thumb;
        }
      }
    }
  } catch {}

  // 3. Fallback: Contextual category-themed image
  const categoryPool = CATEGORY_FALLBACKS[categoryGroup] || CATEGORY_FALLBACKS.sights;
  const hash = Math.abs(cleanName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const fallback = categoryPool[hash % categoryPool.length];
  IMAGE_CACHE.set(cacheKey, fallback);
  return fallback;
}
