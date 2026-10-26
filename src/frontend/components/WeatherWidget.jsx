import React from 'react';
import { Sun, Cloud, CloudRain, CloudSun, CloudFog, CloudDrizzle, Snowflake, CloudLightning, Info } from 'lucide-react';

const ICON_MAP = {
  Sun: Sun,
  CloudSun: CloudSun,
  Cloud: Cloud,
  CloudFog: CloudFog,
  CloudDrizzle: CloudDrizzle,
  CloudRain: CloudRain,
  Snowflake: Snowflake,
  CloudLightning: CloudLightning
};

export default function WeatherWidget({ weather, destinationName, format }) {
  if (!weather) return null;

  const WeatherIcon = ICON_MAP[weather.iconName] || Sun;

  if (format === 'sidebar') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'var(--color-cream)',
        borderRadius: '10px',
        marginBottom: '14px',
        fontSize: '12px',
        color: 'var(--color-text)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <WeatherIcon size={18} color="var(--color-primary)" />
          <div>
            <span style={{ fontWeight: 700 }}>{weather.temperature}°C</span>
            <span style={{ color: 'var(--color-text-secondary)', marginLeft: '6px' }}>{weather.condition}</span>
          </div>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
          {weather.minTemp && weather.maxTemp ? `${weather.minTemp}° / ${weather.maxTemp}°` : destinationName}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--brand-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <WeatherIcon size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)' }}>
              {weather.temperature}°C
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'var(--color-cream)',
              color: 'var(--color-text)'
            }}>
              {weather.condition}
            </span>
            {weather.minTemp && weather.maxTemp && (
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                H: {weather.maxTemp}° • L: {weather.minTemp}°
              </span>
            )}
          </div>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            margin: '2px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Info size={12} color="var(--color-primary)" /> {weather.advice}
          </p>
        </div>
      </div>
    </div>
  );
}
