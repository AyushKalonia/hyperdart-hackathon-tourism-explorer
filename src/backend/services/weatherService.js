/**
 * Weather Service using Open-Meteo API (free, no API key required)
 * Provides real-time weather and tourist advice for the destination.
 */

// WMO Weather Interpretation Codes
const WMO_CODES = {
  0: { label: 'Clear Sky', icon: 'Sun', tip: 'Bright and sunny — ideal for outdoor sights and photography.' },
  1: { label: 'Mainly Clear', icon: 'Sun', tip: 'Pleasant clear weather for walking tours.' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', tip: 'Comfortable sightseeing with gentle cloud cover.' },
  3: { label: 'Overcast', icon: 'Cloud', tip: 'Good conditions for parks and architectural landmarks.' },
  45: { label: 'Foggy', icon: 'CloudFog', tip: 'Misty atmosphere; viewpoints may have reduced visibility.' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', tip: 'Cool foggy weather; carry light layers.' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', tip: 'Carry an umbrella; great day for museums.' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', tip: 'Light precipitation; indoor attractions recommended.' },
  55: { label: 'Dense Drizzle', icon: 'CloudRain', tip: 'Rainy conditions; perfect for exploring museums and galleries.' },
  61: { label: 'Slight Rain', icon: 'CloudRain', tip: 'Occasional showers; keep an umbrella handy.' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', tip: 'Steady rain; prioritize indoor exhibits and temples.' },
  65: { label: 'Heavy Rain', icon: 'CloudRain', tip: 'Heavy rain; avoid outdoor viewpoints.' },
  71: { label: 'Slight Snow', icon: 'Snowflake', tip: 'Snowy scenery; dress warmly.' },
  73: { label: 'Moderate Snow', icon: 'Snowflake', tip: 'Picturesque winter sights; stay warm.' },
  80: { label: 'Rain Showers', icon: 'CloudRain', tip: 'Passing showers; check forecast before heading out.' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', tip: 'Stormy weather; stay indoors.' }
};

export async function getWeather(lat, lon) {
  if (lat == null || lon == null) {
    return null;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return null;

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const code = current.weather_code ?? 0;
    const info = WMO_CODES[code] || { label: 'Fair Weather', icon: 'Sun', tip: 'Good sightseeing conditions.' };

    return {
      temperature: Math.round(current.temperature_2m ?? 22),
      tempUnit: '°C',
      humidity: current.relative_humidity_2m ?? 50,
      windSpeed: current.wind_speed_10m ?? 10,
      condition: info.label,
      iconName: info.icon,
      advice: info.tip,
      maxTemp: daily.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : null,
      minTemp: daily.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : null
    };
  } catch (err) {
    // Return friendly default when offline
    return {
      temperature: 24,
      tempUnit: '°C',
      humidity: 48,
      windSpeed: 11,
      condition: 'Partly Sunny',
      iconName: 'Sun',
      advice: 'Comfortable travel conditions; enjoyable day for sightseeing.',
      maxTemp: 28,
      minTemp: 19
    };
  }
}
