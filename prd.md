# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Tourism Explorer — Intelligent Travel Discovery Component

**Project Type:** Hackathon Web Application + Embeddable Component\
**Version:** 1.0\
**Status:** Proposed\
**Frontend:** React.js, Tailwind CSS, Vite\
**Backend:** Node.js, Express.js\
**Places API:** Geoapify Places API\
**Optional AI:** Groq LLM API\
**Database:** PostgreSQL (optional, based on feature scope)\
**Primary Deliverable:** A published hyperDart Tourism Explorer component

---

# 1. Project Overview

## 1.1 Product Vision

Tourism Explorer is an intelligent, interactive travel discovery component that helps users quickly discover worthwhile tourist attractions in any supported city, region, or destination.

Instead of making users browse long travel articles or multiple websites, Tourism Explorer understands their natural-language queries and presents relevant places in a visually appealing, easy-to-explore interface.

For example, when a user searches for "best places to visit in Kurukshetra," the application should identify the destination, understand that the user wants tourist attractions, fetch real places from a location-based API, filter out irrelevant businesses, and display the most useful results.

The experience should feel like a modern travel companion: fast, informative, visually distinctive, and simple to use.

## 1.2 Problem Statement

Planning a trip often involves searching for attractions, checking different websites, identifying places that match personal interests, and comparing basic information.

Existing search experiences frequently return long articles or mixed results that include restaurants, hotels, shops, and other businesses that are not the main focus of sightseeing discovery.

The Tourism Explorer component addresses this problem by:

- Understanding natural-language tourism queries.
- Identifying the destination and requested attraction category.
- Fetching real attractions near the destination.
- Displaying useful information in a compact interface.
- Making it easy to explore places on a map or plan a day of sightseeing.
- Providing clear feedback when no suitable attractions are available.

## 1.3 Product Goals

1. Deliver relevant tourist attractions without requiring users to browse multiple articles.
2. Support general destination searches and category-specific requests.
3. Present essential information at a glance.
4. Provide a distinctive interface based on the supplied cyan-to-blue color palette.
5. Work in both a full-width/mainline layout and a narrow sidebar.
6. Remain useful when APIs fail, searches return no results, or location data is incomplete.
7. Publish a reusable hyperDart component that meets the hackathon submission requirements.

## 1.4 Target Users

**Primary users**

- Travellers exploring an unfamiliar destination.
- Students planning trips and educational visits.
- Families looking for sightseeing opportunities.
- Solo travellers who want to discover landmarks and cultural attractions.

**Secondary users**

- Developers embedding the component into hyperDart-powered applications.
- Hackathon judges evaluating usability, accuracy, design, and engineering quality.

## 1.5 Product Scope

The project consists of two connected deliverables.

**A. Tourism Explorer Web Demo**

A standalone React web application used to demonstrate the complete experience, test searches, preview responsive layouts, and showcase additional features.

**B. Tourism Explorer hyperDart Component**

The actual embeddable component that receives hyperDart's `searchData` prop, interprets the supplied query and location entities, retrieves attraction data, and renders the results in the host environment.

The standalone website is a demonstration and development environment. It does not replace the requirement to build and publish the actual hyperDart component.

---

# 2. Core Functional Requirements

## 2.1 Natural-Language Search

The application must understand common tourism-related queries, including:

- Tourist attractions in NYC
- Things to do in Paris
- Landmarks in Rome
- Museums in Delhi
- Temples in Varanasi
- Best places to visit in Kurukshetra
- Sights near Tokyo
- Parks around London

### Expected behaviour

1. Receive the user's search query.
2. Identify the destination.
3. Determine the requested attraction category, if any.
4. Retrieve relevant places using destination coordinates.
5. Filter and rank the results.
6. Present the attractions with useful details.

The component must use the destination entity supplied by hyperDart when available, rather than relying exclusively on its own destination-name extraction.

The hackathon-provided `searchData` can arrive as either a single object or an array. The implementation must handle both structures.

## 2.2 Supported Search Categories

The initial release should support the following categories:

| Category        | Example query              |
| --------------- | -------------------------- |
| All attractions | Things to do in Paris      |
| Tourist sights  | Tourist attractions in NYC |
| Landmarks       | Famous landmarks in Rome   |
| Museums         | Museums in Delhi           |
| Temples         | Temples in Varanasi        |
| Monuments       | Monuments in Agra          |
| Forts           | Forts near Jaipur          |
| Parks           | Parks in London            |
| Historic sites  | Historical sites in Athens |
| Viewpoints      | Viewpoints around Tokyo    |

The category list can be extended as needed, depending on the categories supported by the data provider.

### Category matching rules

- A category-specific query should prioritize matching places.
- A general sightseeing query should return a diverse selection of attractions.
- Restaurants, hotels, shops, and unrelated businesses must not appear as primary results.
- If the exact category has no suitable results, the application should communicate that clearly before optionally offering nearby alternatives.

## 2.3 Attraction Cards

Every attraction card should prioritize the information a traveller needs to make a quick decision.

Each card should support:

- Attraction name.
- Attraction category.
- Short description, when available.
- Address or location details, when available.
- Distance from the selected destination coordinates, when calculable.
- Image, when a reliable image source is available.
- Map or directions action.
- More details action, where supporting information exists.

Optional metadata can include coordinates, source attribution, and a website link if the data provider supplies them.

### Card interaction

Clicking or tapping a card should open an expanded detail view, drawer, or modal. This view should show additional available information and provide an action to open the attraction's location in a map application.

The interface must not invent descriptions, opening hours, ratings, ticket prices, or other facts that have not been retrieved from a reliable source.

## 2.4 No-Results Experience

A no-results response is a required feature.

When a query returns no suitable attractions, the component should display:

- A clear message that no matching attractions were found.
- The destination and requested category, where available.
- A suggestion to try a broader category or a nearby destination.
- A retry or modified-search action.

The empty state should look intentional and polished, not like a broken page.

## 2.5 Loading and Error States

The interface must provide dedicated states for:

**Loading:** Display an animated skeleton or compact loading indicator while fetching results.

**API failure:** Explain that attraction data could not be loaded and provide a retry action.

**Invalid or missing location:** Ask the user to provide a valid destination or indicate that the location could not be resolved.

**Partial data:** Continue displaying useful attractions even when some descriptions, images, or other optional fields are missing.

**Rate limit or timeout:** Show a friendly error state and avoid repeatedly issuing requests without user action or an appropriate retry policy.

---

# 3. Proposed Product Experience

## 3.1 Main Interface

The standalone demo should open with a distinctive, modern travel discovery screen.

The interface should have the following hierarchy:

1. Compact brand header.
2. Destination search section.
3. Quick category filters.
4. Destination summary.
5. Attraction discovery area.
6. Map or compact map preview.
7. Optional day-plan section.

The first screen should answer three questions quickly:

- Where am I exploring?
- What places are worth visiting?
- What can I do next?

The design should avoid the appearance of a conventional directory website with a long sequence of identical cards.

## 3.2 Suggested Layout

### Desktop / Mainline Layout

Use a two-column structure:

**Left column — Attraction discovery**

- Destination heading.
- Result count.
- Category chips.
- Attraction cards.
- Load-more interaction if additional results are available.

**Right column — Geographic context**

- Interactive map or compact map panel.
- Attraction markers.
- Selected-attraction details.
- Optional route or day-plan summary.

### Narrow Sidebar Layout

The sidebar version must be independently usable, not merely a compressed desktop page.

In sidebar mode:

- Stack the content vertically.
- Hide or collapse secondary navigation.
- Use compact attraction cards.
- Reduce nonessential metadata.
- Make the map optional or expandable.
- Preserve the search context and essential actions.
- Avoid horizontal overflow and excessively narrow text columns.

The layout should adapt to the actual available container width, rather than relying only on the browser viewport width.

## 3.3 Main User Journey

1. The user enters or triggers a tourism query.
2. The application identifies the location and requested category.
3. The interface displays a loading state.
4. The backend retrieves relevant attractions.
5. The frontend displays the destination heading, category, and results.
6. The user filters the results or opens an attraction.
7. The user explores its details, views it on the map, or requests a day plan.
8. The user can return to the results without losing the search context.

---

# 4. Design System

## 4.1 Design Direction

**Design concept: Blue Horizon — Explore Beyond the Ordinary**

The visual identity should be inspired by the supplied reference image: stacked shades transitioning from bright turquoise and cyan into vivid blue.

The website should feel energetic, modern, clean, and trustworthy. The blue palette should establish a recognizable visual identity without overwhelming the attraction content.

Use a light interface as the default, with a dark mode that maintains the same brand identity.

## 4.2 Primary Colour Palette

The following hexadecimal values are proposed starting points based on the reference image. They can be fine-tuned during implementation.

| Token           | Hex value | Usage                                                    |
| --------------- | --------- | -------------------------------------------------------- |
| Horizon Cyan    | `#00F0E8` | Bright decorative accents and selected visual highlights |
| Aqua Blue       | `#00D9F5` | Secondary highlights and active visual elements          |
| Sky Blue        | `#079BFA` | Interactive accents and information elements             |
| Electric Blue   | `#103EFF` | Primary buttons and key actions                          |
| Deep Blue       | `#1735C7` | Pressed states and strong blue accents                   |
| Navy Ink        | `#172554` | Main headings and high-emphasis text                     |
| Slate Text      | `#475569` | Secondary text                                           |
| Soft Background | `#F5F8FF` | Main page background                                     |
| White           | `#FFFFFF` | Cards and primary surfaces                               |
| Border Blue     | `#DCE7FF` | Dividers, outlines, and card borders                     |

### Colour usage principles

- Use electric blue for the primary CTA and selected states.
- Use cyan and sky blue for decorative gradients, small indicators, and secondary highlights.
- Use navy for readable headings.
- Use white or soft blue-grey for the main content surface.
- Do not use bright cyan for large amounts of small text because readability may suffer.
- Ensure accessible contrast for text, icons, borders, and interactive controls.

### Brand gradient

Use a restrained gradient derived from the supplied image:

`linear-gradient(180deg, #00F0E8 0%, #00D9F5 35%, #079BFA 68%, #103EFF 100%)`

This gradient can appear in the brand mark, a small hero accent, active navigation indicators, and selected visual elements.

Avoid applying the gradient to every card or section. The strongest visual impact should come from contrast between the gradient and clean white surfaces.

## 4.3 Typography

Use **Inter** or **Manrope** as the primary interface typeface.

Recommended hierarchy:

- Page heading: 28–36px on desktop.
- Section heading: 20–24px.
- Attraction title: 16–18px.
- Body text: 14–16px.
- Supporting metadata: 12–14px.
- Button labels: 14–15px, medium or semibold.

Use a clear font-weight hierarchy rather than relying on oversized text throughout the interface.

## 4.4 Spacing and Layout

Use a consistent spacing scale based on multiples of four pixels.

- Small gaps: 4–8px.
- Component spacing: 12–16px.
- Card padding: 16–20px.
- Section spacing: 24–32px.
- Major page spacing: 32–48px.

Suggested radii:

- Buttons and inputs: 10–12px.
- Attraction cards: 16–20px.
- Larger panels: 20–24px.
- Chips: fully rounded.

Cards should use subtle borders and restrained shadows. Avoid heavy shadows, excessive glassmorphism, and unnecessary gradients.

## 4.5 Component Styling

### Search bar

- White surface.
- Rounded corners.
- Subtle blue border.
- Search icon.
- Clear focus ring.
- Optional clear-search action.

### Category chips

- Rounded pill shape.
- Neutral background by default.
- Electric blue background or border when selected.
- Clear hover and focus states.

### Attraction cards

- White background.
- Light blue-grey border.
- Rounded corners.
- Optional thumbnail with consistent aspect ratio.
- Clear title and category hierarchy.
- Compact metadata row.
- One obvious primary interaction.

### Primary button

- Electric blue background.
- White text.
- Rounded corners.
- Subtle hover and pressed states.
- Visible keyboard focus.

### Map panel

- White card container.
- Minimal surrounding controls.
- Clearly differentiated attraction markers.
- Selected marker with a stronger blue treatment.

## 4.6 Dark Mode

The dark theme should use a dark navy base rather than pure black.

Suggested tokens:

- Background: `#0B1220`
- Surface: `#111C32`
- Elevated surface: `#172641`
- Primary text: `#F1F5FF`
- Secondary text: `#A9B9D4`
- Border: `#263B5C`
- Primary action: `#355BFF`

Retain the cyan and blue brand accents, adjusting contrast where necessary.

Dark mode must apply consistently to cards, forms, menus, empty states, map controls, and modals.

## 4.7 Responsive Breakpoints

Use Tailwind CSS responsive utilities, but also support container-based adaptation where needed.

- Small mobile: below 640px.
- Tablet: 640–1023px.
- Desktop: 1024px and above.
- Sidebar: adapt according to the actual host container width.

Acceptance requirement: the component should remain usable without horizontal scrolling in both its mainline and sidebar placements.

---

# 5. Additional Features

The following features can distinguish the product from a basic attraction listing page. They should be implemented after the core search, relevance, and responsive interface work reliably.

## 5.1 Interactive Map

Display attractions on a map, with markers corresponding to the result cards.

Features:

- Select a marker to highlight its corresponding card.
- Select a card to highlight its marker.
- Show a compact place preview.
- Support zoom and pan.
- Make the map collapsible in narrow layouts.

A map provider such as Leaflet with OpenStreetMap tiles may be used, subject to the tile provider's usage policy and attribution requirements.

Map rendering must not prevent users from browsing attractions when the map fails to load.

## 5.2 Smart Category Filtering

Provide quick filters such as:

- All
- Landmarks
- Museums
- Temples
- Historic sites
- Parks
- Viewpoints

Only show filters that make sense for the current result set or the supported category taxonomy.

Changing a filter should update the displayed results without unnecessarily repeating the entire search request.

## 5.3 Attraction Detail Drawer

Selecting a place opens a detail panel containing available information, a larger image if available, coordinates or address, and map directions.

On desktop, use a side drawer where appropriate. On mobile, use a bottom sheet or full-screen detail view.

The panel should have a clear close action and preserve the original results.

## 5.4 AI-Assisted Day Planner

An optional AI feature can turn selected attractions into a simple sightseeing itinerary.

Example request:

"Plan a day in Delhi focused on museums and historic places."

The planner should:

1. Receive the selected attractions and their coordinates.
2. Group places that are geographically close.
3. Suggest a practical visit order.
4. Provide short explanations for the suggested order.
5. Clearly identify any travel-time estimates that are approximate.

Groq can generate a structured itinerary from the supplied attraction data. It must not be treated as the source of truth for place existence, coordinates, opening hours, or travel times.

The application should retain a non-AI fallback that can produce a simple ordered list from the available places.

## 5.5 Weather Preview

Weather is an optional enhancement, not part of the minimum viable product.

If implemented, use a weather provider such as Open-Meteo and show forecast information only when the selected visit date is supported by the provider.

The interface must distinguish forecast data from general climate information and must not imply certainty beyond the forecast's availability.

---

# 6. Technical Architecture

## 6.1 Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router for standalone demo navigation, if needed
- Lucide React for icons
- Axios or the native Fetch API for backend requests
- A map library, such as Leaflet, if map functionality is implemented

### Backend

- Node.js
- Express.js
- Geoapify Places API integration
- Environment-based configuration
- Request validation and centralized error handling

### Optional AI

- Groq API for structured category assistance, concise summaries, and day-plan generation.

### Optional Database

- PostgreSQL for saved trips, saved attractions, user preferences, or other persistent data.

**Architecture recommendation:** Do not make PostgreSQL mandatory for the first release. The core product is a search-and-discovery component that can retrieve attraction data directly through the backend. A database adds value only when persistent user-generated data or application-specific caching is required.

## 6.2 High-Level Architecture

The system should follow this flow:

1. The hyperDart host supplies `searchData`.
2. The React component extracts the query, location entity, coordinates, and category.
3. The component calls the Express backend.
4. Express validates the request and constructs a Geoapify Places API query.
5. Geoapify returns candidate places.
6. The backend normalizes, filters, and ranks the candidates.
7. The frontend renders the attraction cards and associated interactions.

For AI-assisted planning, the frontend sends the selected attraction data to an Express endpoint, which calls Groq and returns a validated structured response.

All private API keys must remain on the backend.

## 6.3 Geoapify Integration

The hackathon statement specifies the Geoapify Places API and provides this general query pattern:

`GET https://api.geoapify.com/v2/places`

The request uses parameters such as:

- `categories`
- `filter`
- `limit`
- `apiKey`

For a location-based search, the filter uses a circular area around the destination coordinates.

Important implementation rules:

- Geoapify expects longitude before latitude in the circle filter.
- Request no more than 20 places per call, as specified in the problem statement.
- Keep the API key out of frontend code and public repositories.
- Use `tourism.sights` as the initial broad category where appropriate.
- Verify category support and returned fields against the provider's current documentation.
- Handle missing geometry, missing properties, and incomplete results safely.

The initial search radius can be configurable, with 5 km as the starting point from the hackathon's example. If results are insufficient, a controlled fallback may expand the radius.

A larger radius should not silently make a nearby search irrelevant; the interface should communicate when results come from a broader area.

## 6.4 Category and Relevance Filtering

The category resolver should first use explicit query patterns and known aliases.

For example:

- "museums in Delhi" → museums.
- "forts near Jaipur" → forts.
- "things to do in Paris" → general attractions.

Groq may be used as an optional fallback for ambiguous natural-language queries. The application should not require an LLM to resolve ordinary, supported search patterns.

The backend should then:

1. Filter candidate results by supported attraction categories.
2. Exclude clearly irrelevant business types.
3. Rank matching categories above less relevant candidates.
4. Use distance and available quality signals as secondary ranking factors.
5. Deduplicate places where the provider returns repeated entries.

Do not treat the provider's broad tourism classification as sufficient proof that every returned result is suitable. Use the returned properties and category information to make relevance decisions.

---

# 7. hyperDart Integration Requirements

The published hyperDart component is the primary hackathon deliverable.

## 7.1 Component Input

The component must accept `searchData` and account for the structure supplied by the host.

Important fields described in the problem statement include:

- `query`
- `entities`
- `entityInfo.geo.lat`
- `entityInfo.geo.long`
- `keyword`
- `userLocation`
- `suggestedPlace`

The exact entity path should be verified against the actual payload shape and normalized in one reusable parsing function.

The destination coordinates should come from the matched location entity whenever available. The user's current location should not silently replace the destination specified in the query.

## 7.2 Trigger Configuration

Add the provided tourism keywords and regex patterns to `hyperdart.config.js`, following the configuration template.

Required keyword coverage includes:

- tourist attractions
- things to do
- places to visit
- landmarks
- sights
- points of interest
- museums

Extend the regex patterns to cover the supported categories, including temples, forts, parks, monuments, viewpoints, and historical sites.

The configuration should also handle common modifiers such as "best," "top," and "famous" when supported by the template.

## 7.3 Component Modes

The component should support:

**Mainline mode:** A spacious discovery interface with attraction cards and an optional map.

**Sidebar mode:** A compact interface with essential attraction information and expandable secondary features.

Both modes must preserve the same underlying search logic and relevance rules.

## 7.4 Publishing Requirements

Before submission:

- Build the component using the supported hyperDart template and conventions.
- Include the required metadata in `hyperdart.config.js`.
- Provide the GitHub repository URL and demo video URL using the template's expected fields.
- Create the package in the hyperDart Partner Portal.
- Configure the publishing token securely.
- Publish with the normal `npm publish` command.
- Allow the provided prepublish validation to run successfully.

Do not bypass validation with `--ignore-scripts` or by removing the required validation hook.

---

# 8. Backend API Specification

The following routes are proposed for the Express implementation. Route names may be adjusted to fit the selected hyperDart template.

## 8.1 Search Attractions

**Endpoint:** `GET /api/attractions`

Example:

`/api/attractions?lat=29.9695&lon=76.8783&category=museum&radius=5000`

Parameters:

- `lat`: destination latitude.
- `lon`: destination longitude.
- `category`: optional category filter.
- `radius`: search radius in metres, within configured limits.
- `limit`: optional result limit, capped at the provider's allowed maximum.

Response:

- Destination search parameters.
- Normalized attraction array.
- Result count.
- Any relevant pagination or fallback metadata.

Each normalized attraction should contain only the fields supported by the provider, such as:

- `id`
- `name`
- `category`
- `address`
- `lat`
- `lon`
- `description`, when available
- `imageUrl`, when reliably available
- `source`
- `distanceMeters`, when calculated

The backend should never expose the Geoapify API key.

## 8.2 Attraction Details

**Endpoint:** `GET /api/attractions/:id`

Returns additional information for a selected attraction when the underlying data source supports it.

If a provider does not support retrieving a place by the selected identifier, the backend should use a documented alternative or return an appropriate response. It must not assume every identifier can be used for a detail lookup.

## 8.3 AI Day Plan

**Endpoint:** `POST /api/itinerary`

Request:

- Destination.
- Selected attractions.
- Optional user preferences.
- Available visit duration.

Response:

- Suggested itinerary.
- Ordered attraction identifiers.
- Short explanations.
- Any relevant limitations or assumptions.

The server must validate the model response before returning it. The AI should select from the supplied attraction list rather than inventing new places.

## 8.4 Health Check

**Endpoint:** `GET /api/health`

Returns basic server status without exposing credentials or internal configuration.

## 8.5 Error Handling

Use consistent error responses with an appropriate HTTP status code and a readable message.

Examples:

- `400` — Invalid query or coordinates.
- `404` — Requested attraction not found.
- `429` — Rate limit exceeded.
- `502` — Upstream provider failure.
- `503` — Required upstream service unavailable.
- `500` — Unexpected server error.

The frontend should convert these responses into understandable interface states rather than displaying raw stack traces.

---

# 9. PostgreSQL Data Model (Optional)

PostgreSQL is not required for the minimum viable component.

If persistent features are introduced, use PostgreSQL to store user-created data rather than duplicating the entire external attractions catalogue.

Suggested tables:

### Users

- `id`
- `email`
- `created_at`

### Saved Trips

- `id`
- `user_id`
- `title`
- `destination`
- `created_at`
- `updated_at`

### Saved Attractions

- `id`
- `trip_id`
- `external_place_id`
- `name`
- `category`
- `latitude`
- `longitude`
- `position`

### User Preferences

- `id`
- `user_id`
- `preferred_categories`
- `updated_at`

These tables should be implemented only if saved trips, accounts, or persistent preferences are part of the chosen scope.

For the hackathon MVP, avoid introducing authentication and database complexity unless these features materially improve the required experience.

---

# 10. Groq LLM Integration

## 10.1 Purpose

Groq should enhance the user experience without becoming a dependency for the essential search workflow.

Recommended use cases:

- Interpreting ambiguous queries.
- Generating concise summaries from verified attraction data.
- Producing structured day plans.
- Explaining why selected attractions fit a user's stated interests.

## 10.2 AI Safety and Accuracy Rules

The AI must not be the primary source of factual attraction data.

It must not independently invent:

- Attraction names or existence.
- Coordinates.
- Opening hours.
- Ticket prices.
- Ratings.
- Travel times presented as verified facts.

Any generated itinerary should reference real attraction identifiers from the backend response.

If Groq is unavailable, the core discovery component must continue to work.

AI responses should be validated against a known schema before they are rendered.

---

# 11. Non-Functional Requirements

## 11.1 Performance

- Render the main interface immediately, before optional content finishes loading.
- Use skeleton states during API requests.
- Avoid repeated identical upstream requests when safe caching is possible.
- Use debouncing for interactive search inputs.
- Avoid unnecessary React re-renders.
- Load maps and optional AI features only when needed.

Suggested performance targets:

- Local interface interaction: responsive without perceptible delays under normal conditions.
- Cached or simple backend responses: target a response time below 1 second where practical.
- External search: aim for a useful response within 2–3 seconds under normal network conditions.

These are engineering targets, not guaranteed provider response times.

## 11.2 Security

- Store secrets in environment variables.
- Never expose Geoapify or Groq API keys in frontend bundles.
- Validate and limit user-supplied coordinates and parameters.
- Configure CORS for the intended host and development environments.
- Apply sensible rate limits to backend endpoints.
- Avoid logging sensitive headers or credentials.
- Validate AI-generated output before returning it.
- Use a `.gitignore` that excludes `.env`, `node_modules`, build output, and other local-only files.

## 11.3 Accessibility

- Support keyboard navigation.
- Use semantic HTML.
- Provide visible focus states.
- Give icon-only buttons accessible labels.
- Ensure readable colour contrast.
- Do not rely on colour alone to communicate selection or status.
- Support reduced-motion preferences where practical.

## 11.4 Browser and Device Support

Target current versions of Chrome, Edge, Firefox, and Safari.

The interface should work on mobile, tablet, and desktop. The embedded component must also work in the constrained dimensions of the host application.

---

# 12. Suggested Project Structure

The repository should separate the frontend, backend, and hyperDart package responsibilities.

```text
tourism-explorer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── CategoryFilters.jsx
│   │   │   ├── AttractionCard.jsx
│   │   │   ├── AttractionGrid.jsx
│   │   │   ├── AttractionDetails.jsx
│   │   │   ├── MapPanel.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── LoadingSkeleton.jsx
│   │   ├── pages/
│   │   │   └── ExplorerPage.jsx
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── attractionApi.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── attractionRoutes.js
│   │   │   └── itineraryRoutes.js
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── geoapifyService.js
│   │   │   └── groqService.js
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── hyperdart-component/
│   ├── src/
│   ├── hyperdart.config.js
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

The exact directory layout should follow the hyperDart template where its conventions differ from this proposal.

---

# 13. Acceptance Criteria

The MVP is considered complete when the following conditions are met.

### Search and relevance

- [ ] General attraction queries work for supported destinations.
- [ ] Category-specific queries return matching categories where suitable data exists.
- [ ] The destination coordinates are taken from the correct hyperDart location entity.
- [ ] The implementation handles `searchData` supplied as either an object or an array.
- [ ] Primary results do not consist of restaurants, hotels, or shops.
- [ ] Results include names and locations, with descriptions when available.

### Interface

- [ ] The mainline interface is usable on desktop and mobile.
- [ ] The sidebar interface remains usable at narrow widths.
- [ ] The blue colour scheme is applied consistently.
- [ ] Loading, empty, error, and partial-data states are implemented.
- [ ] Attraction cards expose useful details and map actions.
- [ ] Light and dark themes are usable if theme switching is included.

### Engineering

- [ ] The Geoapify key is kept on the backend.
- [ ] Backend requests validate their inputs.
- [ ] API failures do not crash the component.
- [ ] Unsupported or missing data is handled safely.
- [ ] AI failures do not break basic attraction search.
- [ ] Secrets and build artefacts are excluded from version control.

### Submission

- [ ] The source code is in a public GitHub repository.
- [ ] The README explains the product, design, data sources, libraries, and development process.
- [ ] AI tools and the work they contributed to are documented honestly.
- [ ] The component passes the normal hyperDart publishing validation.
- [ ] The package is published to the hyperDart dev registry.
- [ ] A 2–3 minute YouTube demo is available.
- [ ] The repository and demo video links are correctly configured.

---

# 14. Testing Strategy

## 14.1 Functional Tests

Test the following queries:

| Query                               | Expected behaviour                         |
| ----------------------------------- | ------------------------------------------ |
| Tourist attractions in NYC          | General sightseeing attractions            |
| Things to do in Paris               | Diverse tourist attractions                |
| Landmarks in Rome                   | Landmarks and historical sites prioritized |
| Museums in Delhi                    | Museum-focused results                     |
| Best places to visit in Kurukshetra | Relevant attractions near Kurukshetra      |
| Sights near Tokyo                   | Attractions around the specified location  |
| Temples in Varanasi                 | Temple-focused results                     |

## 14.2 Edge Cases

- Unknown destination.
- Missing location coordinates.
- Empty provider response.
- Invalid category.
- No attractions within the initial search radius.
- Duplicate attractions.
- Attraction with no description.
- Attraction with no image.
- Geoapify timeout.
- Geoapify rate limit.
- Groq timeout or malformed response.
- Narrow sidebar container.
- Long attraction names.
- Switching between categories while a request is pending.

## 14.3 Responsive and Accessibility Tests

- Mobile portrait and landscape.
- Tablet layouts.
- Desktop mainline layout.
- Narrow embedded sidebar.
- Keyboard-only interaction.
- Focus visibility.
- Dark theme contrast.
- Map unavailable.
- Reduced-motion settings.

---

# 15. Hackathon Judging Strategy

The implementation should be prioritized according to the official judging weights.

| Judging criterion           | Weight | Product strategy                                                                                    |
| --------------------------- | -----: | --------------------------------------------------------------------------------------------------- |
| Design and creativity       |    25% | Distinctive blue identity, polished cards, map interactions, and strong sidebar adaptation          |
| Usefulness and clarity      |    20% | Destination and category immediately visible; relevant attractions presented at a glance            |
| Accuracy and relevance      |    15% | Correct destination coordinates, category filtering, and exclusion of unrelated businesses          |
| Robustness                  |    15% | Reliable handling of empty results, invalid inputs, API failures, and missing fields                |
| Understanding (live review) |    15% | Readable architecture, explainable filtering rules, and easily extendable query patterns            |
| Code quality and README     |    10% | Clean repository, secure environment variables, documented data sources, and successful publication |

Extra features should be added only after the required functionality is reliable.

## Recommended differentiation

Instead of adding many unrelated features, concentrate on three distinctive interactions:

1. **Discovery at a glance:** A polished attraction card system with category indicators and clear actions.
2. **Explore spatially:** A map linked directly to the result cards.
3. **Plan intelligently:** An optional day planner that creates a sensible order from verified attractions.

Together, these make the component more useful than a simple list of API results while keeping the product focused.

---

# 16. Implementation Roadmap

## Phase 1 — Core foundation

- Initialize the React and Tailwind frontend.
- Set up the Express backend.
- Configure environment variables.
- Connect the Geoapify API.
- Build a working attraction search endpoint.
- Implement destination and category parsing.
- Test with multiple cities.

**Deliverable:** Real attraction data displayed in the frontend.

## Phase 2 — Product interface

- Implement the design tokens and typography.
- Build the search and category components.
- Build attraction cards and detail panels.
- Add loading, empty, and error states.
- Implement the mainline and sidebar layouts.
- Test responsive behaviour.

**Deliverable:** A complete and polished discovery experience.

## Phase 3 — Relevance and resilience

- Improve category filtering and ranking.
- Handle duplicate and incomplete records.
- Add controlled radius expansion where useful.
- Add request validation, rate limiting, and safe error handling.
- Test API failure scenarios.

**Deliverable:** A reliable core search experience.

## Phase 4 — Differentiating features

- Add map integration.
- Link map markers to attraction cards.
- Add the optional AI day planner.
- Add weather or saved trips only if time permits.

**Deliverable:** A richer discovery experience without compromising core functionality.

## Phase 5 — hyperDart packaging and submission

- Integrate the actual `searchData` prop.
- Add and test the required keywords and regex patterns.
- Verify object and array input handling.
- Test mainline and sidebar placement.
- Create the public repository and README.
- Configure package metadata and links.
- Run the standard publish validation.
- Publish the component.
- Record the demo video.

**Deliverable:** A working, published hackathon component and a demonstrable project.

---

# 17. Final MVP Definition

The first complete version must include:

1. Natural-language tourism query support.
2. Destination extraction from hyperDart's supplied search data.
3. Category-aware attraction retrieval through Geoapify.
4. Relevance filtering to exclude unrelated businesses.
5. Attraction cards with names, location details, and available descriptions.
6. Loading, empty, and error states.
7. A responsive blue-themed interface.
8. Functional mainline and sidebar layouts.
9. A secure Express backend.
10. The actual hyperDart package configuration and publishing workflow.
11. A public GitHub repository and clear README.

The map, AI itinerary, weather, PostgreSQL-backed saved trips, and user accounts are secondary features. They should not delay the MVP.

# 18. Product Success Metrics

Use the following criteria to evaluate whether the product works well:

- **Query coverage:** All required example queries are handled correctly.
- **Category precision:** Category-specific searches prioritize appropriate attractions.
- **Location accuracy:** Results are based on the intended destination, not an accidentally substituted user location.
- **Time to value:** Users can identify useful attractions without navigating through lengthy articles.
- **Responsive reliability:** The component remains usable in both full-width and narrow sidebar layouts.
- **Failure recovery:** Empty and failed requests produce understandable messages and useful recovery actions.
- **Publication readiness:** The package builds, validates, and publishes successfully.
- **Demonstrability:** The core experience can be explained and demonstrated clearly within the required video duration.

These metrics are intended as practical evaluation criteria; numerical targets can be established after testing the first working version.

---

# Conclusion

Tourism Explorer should be built as a focused, intelligent sightseeing discovery component rather than a conventional travel booking website.

The strongest implementation will combine reliable attraction data, correct destination and category understanding, a memorable blue visual identity, thoughtful responsive design, and a clean integration with hyperDart.

The recommended approach is to build the core experience first, verify the relevance of real attraction results, and then add the map and AI planner as differentiating features. PostgreSQL should remain optional unless the project introduces persistent saved trips or other user-generated data.

**The final objective is a product that answers “What is worth seeing here?” quickly, clearly, and beautifully—and that can be successfully demonstrated, explained, and published as the required hyperDart component.**
