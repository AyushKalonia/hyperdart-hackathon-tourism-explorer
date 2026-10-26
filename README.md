# Tourism Explorer — Intelligent Travel Discovery Component

[![hyperDart Component](https://img.shields.io/badge/hyperDart-Component-FF933E?style=flat-square&logo=react)](https://hyperdart.com)
[![Pre-publish Validation](https://img.shields.io/badge/Validation-Passing-16a34a?style=flat-square)](scripts/validate-publish.js)
[![Theme](https://img.shields.io/badge/Theme-Warm%20Sunset%20%26%20Amber-FFB057?style=flat-square)](#design-system)
[![License](https://img.shields.io/badge/License-MIT-352B23?style=flat-square)](LICENSE)

**Tourism Explorer** is a production-ready, intelligent travel discovery component built for the **hyperDart** platform. It interprets arbitrary natural-language queries (e.g. *"best places to visit in Kurukshetra"*, *"museums in Delhi"*, *"things to do in Paris"*) and delivers verified tourist sights, authentic photography, interactive geographic context, live weather, and an AI-powered day itinerary planner.

---

## Table of Contents

1. [Judging Criteria Alignment](#judging-criteria-alignment)
2. [Key Features & Capabilities](#key-features--capabilities)
3. [Architecture & Data Flow](#architecture--data-flow)
4. [Design System (Warm Sunset & Earth Palette)](#design-system)
5. [API Security & Zero-Frontend-Secrets Guarantee](#api-security)
6. [Live Review Guide (How to Make a Live Change)](#live-review-guide)
7. [Installation & Running Locally](#installation--running-locally)
8. [Build & Pre-publish Validation](#build--pre-publish-validation)
9. [Benchmark Test Queries](#benchmark-test-queries)

---

## Judging Criteria Alignment

| Criterion | Weight | What Judges Look For | How Tourism Explorer Excels |
| :--- | :---: | :--- | :--- |
| **Design and Creativity** | **25%** | Original, unique design and interaction that works in sidebar and mainline, light and dark. | • **Warm Sunset Palette**: Tailored `#FF933E`, `#FFE9A9`, `#352B23` design system with zero generic blue.<br>• **Responsive Dual Layout**: Full 2-column mainline layout + stacked vertical sidebar layout (<600px).<br>• **Instant Evaluator Controls**: Header buttons to toggle between **Mainline/Sidebar** and **Light/Dark** mode with 1 click.<br>• **Ergonomic Modals**: Top-anchored glassmorphism modals with smooth scroll.<br>• **Audio Narration**: Web Speech text-to-speech for each attraction. |
| **Usefulness and Clarity** | **20%** | How quickly the component shows what's worth seeing in the place asked about. | • **Instant Discovery**: Shows top spots with authentic photos, star ratings, and distance from city center.<br>• **Live Weather Widget**: Current temperature, conditions, and practical traveller clothing advice.<br>• **Category Filtering**: Fast pill filters (*Landmarks, Museums, Temples, Forts, Parks, Viewpoints, Historic*) with live count badges.<br>• **AI Day Planner**: Generates structured morning-to-evening itineraries with transit legs, duration, and insider tips. |
| **Accuracy and Relevance** | **15%** | Real tourist places near the right location; no restaurants, hotels or shops as primary results. | • **Strict Exclusion Filter**: Backend rigorously filters out hotels, restaurants, cafes, supermarkets, pet stores, and commercial services.<br>• **Authentic Place Photos**: Wikipedia PageImages & Wikimedia Commons search generator ranks photos by article relevance.<br>• **Benchmark Cities**: Verified curated landmarks for Kurukshetra, New York, Paris, Rome, Delhi, Varanasi, and Tokyo. |
| **Robustness** | **15%** | Behaviour across different places, categories and queries, API failures and empty results. | • **Multi-Tiered Geocoding**: Groq LLM NLP $\rightarrow$ Geoapify Geocoder $\rightarrow$ OpenStreetMap Nominatim $\rightarrow$ Curated Benchmarks.<br>• **Groq AI Error Insights**: When given gibberish or invalid locations (e.g. *"zebrish"*, *"asdfghjk"*), displays an intelligent explanation with 3 interactive query suggestion chips.<br>• **Race Condition Prevention**: `searchIdRef` ensures rapid sequential queries never overwrite state out of order.<br>• **Zero NYC Stale Leaks**: Non-existent locations cleanly reset coordinates to prevent showing default cities. |
| **Understanding (Live Review)** | **15%** | Explaining the code and making a small change live, for example adding a query pattern. | • **Modular Architecture**: Clean separation between frontend components (`src/frontend/components/`) and backend services (`src/backend/services/`).<br>• **Simple Extensibility**: Adding a new query pattern or category filter requires modifying just 2–3 lines in `hyperdart.config.js` and `nlpSearchService.js` (see [Live Review Guide](#live-review-guide)). |
| **Code Quality and README** | **10%** | Readable code, a clear README, and the API key kept out of the frontend. | • **API Keys Kept Out of Frontend**: All API keys (`GROQ_API_KEY`, `GEOAPIFY_API_KEY`) reside exclusively in backend environment variables (`src/backend/.env`).<br>• **Zero Client Secrets**: Client bundle contains zero hardcoded keys.<br>• **Readable, Lint-Free Code**: Idiomatic React 19 hooks and ES modules. |

---

## Key Features & Capabilities

- 🎯 **NLP Query Understanding:** Understands intent from queries like *"museums in Delhi"*, *"historical forts in Jaipur"*, or *"what to see near Tokyo"*.
- 🗺️ **Synchronized Interactive Map:** Leaflet map with custom warm amber/orange SVG pins and pulsating halo on the selected attraction. Selecting a card pans the map; clicking a map pin highlights the card.
- ☀️ **Real-Time Weather Widget:** Live Open-Meteo weather integration displaying temperature, weather condition icons, and smart traveller clothing advice.
- 🗓️ **AI Day Planner Modal:** Allows users to choose their preferred pace (*Balanced*, *Culture & Heritage*, *Photo & Sunset*, *Highlights*, *Family Friendly*) and duration (4h to 12h) to generate an optimized itinerary with travel times.
- 🎧 **Web Speech Audio Guide:** Built-in text-to-speech audio reader on every card and detail modal.
- 🔗 **Google Maps Direct Navigation:** "Location" button launches Google Maps Search for the place; "Directions" button launches Google Maps Turn-by-Turn routing.
- 🌓 **One-Click Theme & Layout Switcher:** Instant toggles in the header to preview Light/Dark modes and Mainline/Sidebar layouts.

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│             hyperDart Platform / User Query                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Injects props.searchData & format)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  src/frontend/TourismExplorerApp.jsx (wrapped with withHD)  │
│  ├── BrandHeader (Layout & Theme Switchers, Day Plan CTA)   │
│  ├── SearchBar (Synchronized NLP input with quick chips)    │
│  ├── CategoryFilters (Pills with real-time counts)          │
│  ├── WeatherWidget (Live temperature & traveller advice)    │
│  ├── AttractionGrid / AttractionCard (Photos, audio, maps)  │
│  ├── MapPanel (Leaflet map with interactive SVG pins)       │
│  ├── AttractionDetailModal (Top-anchored detail view)       │
│  ├── DayPlannerModal (AI Day Itinerary with style vibes)    │
│  └── ErrorState (Groq AI Error Insights with recovery chips)│
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP calls to Cloudflare Worker / Express
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  src/backend/index.js (Port 3001)                           │
│  ├── GET  /api/geocode      ──► Groq NLP + Geoapify + OSM   │
│  ├── GET  /api/attractions  ──► Geoapify Places + Wikipedia │
│  ├── GET  /api/weather      ──► Open-Meteo Forecast         │
│  ├── POST /api/itinerary    ──► Groq LLM (Qwen-27B) / TSP   │
│  └── POST /api/error-insight──► Groq LLM Recovery Guidance  │
└─────────────────────────────────────────────────────────────┘
```

---

## Design System

Tourism Explorer uses an original, warm **Sunset & Earth Palette**:

| Token | CSS Variable | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `--color-primary` | `#FF933E` | Primary buttons, active markers, accents |
| **Primary Hover** | `--color-primary-hover` | `#F5802A` | Button hover and active states |
| **Secondary** | `--color-secondary` | `#D97706` | Warm amber secondary accents |
| **Accent Gold** | `--color-accent` | `#FFCB56` | Star ratings, badges, highlights |
| **Cream Pill** | `--color-cream` | `#FFE9A9` | Notification chips, weather pills |
| **Background** | `--color-background` | `#FFFCF5` | Warm off-white page background |
| **Surface** | `--color-surface` | `#FFFFFF` | Cards, modals, search bar surface |
| **Text Primary** | `--color-text` | `#352B23` | High-contrast headings and body text |
| **Text Muted** | `--color-text-secondary`| `#7C7063` | Subtitles, distances, metadata |
| **Border** | `--color-border` | `#EAE2D4` | Outlines, dividers, card borders |

**Brand Gradient:**
```css
linear-gradient(135deg, #FF933E 0%, #FFB057 45%, #FFCB56 100%)
```

---

## API Security

In strict accordance with the hackathon judging criteria:
> **"and the API key kept out of the frontend"**

1. **Zero Client-Side Secrets:** Neither `GROQ_API_KEY` nor `GEOAPIFY_API_KEY` is present anywhere in `src/frontend/`.
2. **Server-Side Isolation:** All external API requests requiring credentials occur strictly in `src/backend/` using server environment variables (`process.env` / Cloudflare bindings).
3. **Resilient Local Fallbacks:** Even if no external API keys are configured, the component functions with curated benchmarks, Open-Meteo weather, and heuristic TSP itinerary planning.

---

## Live Review Guide

During live evaluation, judges may ask to explain the code or make a small change live. Here is where the key elements live:

### 1. Adding a New Query Pattern or Trigger Keyword
Open [hyperdart.config.js](file:///hyperdart.config.js) and add the new keyword or regex pattern:
```javascript
// In triggers.keywords:
'palaces', 'waterfalls', 'beaches'

// In query_format.regex:
'((best|top|famous)\\s+)?(palaces?|waterfalls?|beaches?)\\s+(in|near|around)\\s+HD_LOCATION(__\\w+)?.*'
```

### 2. Adding a New Category Filter
1. In [CategoryFilters.jsx](file:///src/frontend/components/CategoryFilters.jsx), add the item to `CATEGORIES`:
   ```javascript
   { id: 'beaches', label: 'Beaches', icon: Waves }
   ```
2. In [geoapifyService.js](file:///src/backend/services/geoapifyService.js), add the mapping to `CATEGORY_MAP`:
   ```javascript
   beaches: 'beach,natural.water'
   ```

### 3. Adding a New Curated City Benchmark
Open [curatedPlaces.js](file:///src/backend/data/curatedPlaces.js) and add the city entry with its `destination`, `lat`, `lon`, and `attractions` array.

---

## Installation & Running Locally

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm 9+

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd src/backend
npm install
cd ../..
```

### 2. Configure Backend Secrets (Optional)
Copy the example environment file:
```bash
cp src/backend/.env.example src/backend/.env
```
Edit `src/backend/.env`:
```env
PORT=3001
GEOAPIFY_API_KEY=your_geoapify_key_here
GROQ_API_KEY=your_groq_key_here
```
*(If no API keys are provided, Tourism Explorer runs gracefully with its curated benchmarks and open-access APIs).*

### 3. Run Locally

**Terminal 1 — Backend Worker (Port 3001):**
```bash
cd src/backend
npx wrangler dev --port 3001
```

**Terminal 2 — Frontend Dev Server (Port 5173):**
```bash
npm start
```
Open `http://localhost:5173` to explore the interactive component in the hyperDart Sandbox.

---

## Build & Pre-publish Validation

To validate and build the production bundle:

```bash
# 1. Build frontend bundle (creates dist/frontend/index.modern.js)
npm run build

# 2. Build backend worker (creates dist/backend/index.js)
cd src/backend && npm run build && cd ../..

# 3. Run hyperDart pre-publish validation
npm run prepublishOnly
```

Expected Output:
```
✔ Pre-publish validation passed.
```

---

## Benchmark Test Queries

| Query | Destination | Category | Behavior |
| :--- | :--- | :--- | :--- |
| **"best places to visit in Kurukshetra"** | Kurukshetra | All / Heritage | Brahma Sarovar, Jyotisar, Panorama Centre, Sheikh Chehli's Tomb |
| **"Tourist attractions in NYC"** | New York City | Sights & Landmarks | Central Park, Empire State Building, High Line, Met Museum |
| **"Things to do in Paris"** | Paris | All Attractions | Eiffel Tower, Louvre Museum, Arc de Triomphe, Sainte-Chapelle |
| **"Landmarks in Rome"** | Rome | Landmarks | Colosseum, Pantheon, Trevi Fountain, Roman Forum |
| **"museums in Delhi"** | Delhi | Museums | National Museum, crafts & historic galleries (no hotels/shops) |
| **"Temples in Varanasi"** | Varanasi | Temples | Kashi Vishwanath, Dashashwamedh Ghat, Sarnath Stupa |
| **"Sights near Tokyo"** | Tokyo | Sights | Sensō-ji Temple, Tokyo Skytree, Meiji Shrine, Ueno Park |
| **"zebrish" / "asdfghjk"** | Gibberish | Error State | Structured Groq AI Error Insight + 3 interactive recovery chips |

---

## Engineering & AI Disclosure

- **Base Template:** Built upon the official `@hyperdart/create-hyper-dart` (`react-vite-express`) template, preserving `withHD` wrapping, pre-publish validation checks, and Cloudflare Worker contracts.
- **AI Acceleration:** Developed with Antigravity AI pair programming for rapid schema typing, Wikipedia PageImages sorting, and Leaflet SVG pin styling.
- **Strict Guardrails:** All Groq prompts enforce strict JSON object output, preventing hallucinated coordinates or non-existent attractions.
