# Mapbox React TypeScript Template

A ready-to-use template for building Mapbox GL JS applications with React, TypeScript, and Vite.

## Features

- ✅ React 18 with TypeScript
- ✅ Mapbox GL JS integration
- ✅ Vite for fast development and building
- ✅ ESLint configuration
- ✅ Ready for Vercel deployment
- ✅ Proper CSS styling for full-screen maps
- ✅ TypeScript type safety

## Quick Start

### 1. Use this template

```bash
# Clone this repository
git clone https://github.com/yourusername/mapbox-react-typescript-template.git my-mapbox-project

# Navigate to the project
cd my-mapbox-project

# Install dependencies
npm install
```

### 2. Set up your Mapbox access token

Replace the access token in `src/Map.tsx`:

```typescript
mapboxgl.accessToken = "your-mapbox-access-token-here";
```

Get your access token from [Mapbox](https://account.mapbox.com/access-tokens/).

### 3. Start developing

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── Map.tsx          # Main Mapbox component
├── App.tsx          # App component
├── App.css          # Map styling
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Customization

### Change Map Style

In `src/Map.tsx`, modify the style URL:

```typescript
style: "mapbox://styles/mapbox/streets-v12"  // Streets
style: "mapbox://styles/mapbox/satellite-v9" // Satellite
style: "mapbox://styles/mapbox/dark-v11"     // Dark
```

### Change Initial View

Modify the center and zoom in `src/Map.tsx`:

```typescript
center: [-74.5, 40], // [longitude, latitude]
zoom: 9,             // Zoom level (0-22)
```

## Deployment

This template is ready for deployment on Vercel, Netlify, or any static hosting service.

## License

MIT
