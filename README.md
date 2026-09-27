# Mustofa’s portfolio

React, TypeScript, and Vite. The existing application shell and content were preserved while completing the Figma implementation.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The server prints the available local URL. No environment variables, external services, or API keys are needed to run the portfolio.

## Design and implementation

- `src/Portfolio.tsx`: profile, work and PR rows, contact copy, mode tabs, showcase shells, rulers, and Jakarta clock.
- `src/content.ts`: content, showcase metadata, and destination URL configuration.
- `src/styles.css`: portfolio layout, link animation, and design tokens.
- `src/RulerOverlay.tsx`: responsive red guides measured from each composition’s elements.
- `src/demos/`: five coded Static compositions, shared presentation helpers, and exact Figma component styles.
- `public/assets/`: production WebP and original Figma SVG assets.
- `public/fonts/`: locally hosted Inter Regular and Medium, with their license.
- `design/figma/`: source exports and inspected MCP design context. These are not shipped with the site.
- `design/IMPLEMENTATION.md`: Figma measurements, implementation decisions, and verification notes.

Static mode renders all five studies using React, CSS, real text, and original SVG icons. Photos remain optimized image assets. The illustrations preserve the reference state; Interaction is visibly disabled until its designs are supplied. Each card has an independent red ruler overlay, initially off, anchored to its rendered elements.

Project, studio, and social destinations supplied by Mustofa are configured in `links` in `src/content.ts`. All supplied links, email, and the Selected work anchor are active.

## Asset regeneration

The checked-in production images are ready to use. To regenerate them, run `scripts/optimize-assets.cjs` with an available Sharp installation:

```sh
SHARP_MODULE=/absolute/path/to/sharp node scripts/optimize-assets.cjs
```

The optimizer processes only the profile and participant photos. Agent orbs use isolated original Figma SVG exports. Former whole-composition WebP files are retained under `design/figma/retired-production/` for reference and are not shipped.

## Browser QA

With a production preview running and an existing Playwright installation plus Google Chrome:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright QA_URL=http://127.0.0.1:4174 node scripts/qa.cjs
```

The script exercises the real browser controls, checks Figma geometry and responsive layouts, and writes screenshots and a report under ignored `artifacts/qa/`. Sharp and Playwright were used from the Codex runtime; neither was added as an application dependency.

The project-local TypeSafe skill remains available at `.agents/skills/typesafe-ai/SKILL.md`. This visual polishing pass does not require semantic AI judgments, so no TypeSafe SDK or service was added.
