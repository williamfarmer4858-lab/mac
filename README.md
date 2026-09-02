# McDelivery-style UAE ordering demo

An original, McDelivery-inspired ordering landing page built for the UAE market using adapted menu structure guidance from McDonald's UAE. This project is a **demo storefront** and does not claim any official affiliation.

## Features

- Mobile-first landing experience with hero, category navigation, menu grid, cart drawer, and mock checkout
- UAE-inspired categories including burgers, chicken, breakfast, desserts, beverages, and Happy Meal
- Search plus category and veg/non-veg filtering
- Cart quantity controls with live subtotal
- Localization-ready foundations with English default and RTL preview support
- Data-driven menu content in `/src/data/menu.js`

## Run locally

This repository uses a lightweight, dependency-free setup.

```bash
npm run dev
```

Then open `http://localhost:4173`.

## Build

```bash
npm run build
```

The production-ready static output is written to `/dist`.

## Test

```bash
npm test
```

## Customization notes

- Update UAE-inspired categories or products in `/home/runner/work/mac/mac/src/data/menu.js`
- Placeholder AED prices are clearly marked in the UI with `*` and a note in the menu section
- The RTL preview toggle changes `dir` between `ltr` and `rtl` to help future Arabic localization

## Assumptions

- McDonald's UAE content could not be fetched directly from this environment, so the menu structure is based on high-level public references to the UAE site and adapted copy
- Where exact prices were not available, placeholder AED pricing was used and labeled accordingly