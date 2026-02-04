# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlexDB is a single-page exercise browser application with filtering, search, and detailed exercise views.

## Architecture

```
sport/
├── index.html       # HTML structure only
├── css/
│   └── styles.css   # All styles (variables, components, responsive)
├── js/
│   ├── data.js      # Exercise database (EX array, ~900 exercises)
│   └── app.js       # Application logic
└── flexdb_1.html    # Legacy single-file version (deprecated)
```

**No build system** - Open `index.html` directly in a browser. Uses vanilla JS with no frameworks.

## Key Files

### js/app.js
- `State` object - holds filter state and pagination
- `bodySVG(primaryMuscles, secondaryMuscles, big)` - generates muscle highlight SVG diagrams
- `init()` - initializes filters from data, renders stats
- `loadExercises()` - applies filters, renders cards and pagination
- `showDetail(id)` - renders exercise modal with images, muscles, instructions

### js/data.js
- `EX` array - exercise objects with: `id`, `name`, `force`, `level`, `mechanic`, `equipment`, `primaryMuscles`, `secondaryMuscles`, `category`, `instructions`, `images`, `youtubeSearch`
- `CAT_CLS` object - maps category names to CSS badge classes

### css/styles.css
- CSS custom properties in `:root` for theming (colors, spacing)
- Component styles: `.card`, `.modal`, `.fb` (filter button), `.pg` (pagination)
- Responsive breakpoints at 768px and 480px

## Development

1. Open `index.html` in browser
2. Edit files, refresh to see changes
3. Data changes go in `js/data.js`, logic in `js/app.js`, styles in `css/styles.css`
