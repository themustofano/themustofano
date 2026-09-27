# Figma implementation record

Source: [Website, node 4941:161](https://www.figma.com/design/GPY7nKW5wetucWGI8XXMz2/Luthor---Mega-Design-File?node-id=4941-161), on page `3052:577` (XX Archive). Inspected through Figma MCP on 2026-09-27.

## State recovered from the interrupted run

There is no `.git` directory in this workspace. Both `git status` and `git diff` were attempted; neither can provide a repository history. A SHA-256 inventory was recorded before resuming work. `resume-changes.json` lists all added, modified, and relocated files against that inventory; no original file was removed without a matching retained copy.

The existing React/Vite configuration, dependency lock, HTML entry point, `Portfolio.tsx`, `content.ts`, and `main.tsx` survived unchanged. Source images, SVGs, the full-page Figma reference, and the local TypeSafe skill were retained. Initially Vite could not render the application because `src/styles.css` and the imported interactive showcase module were missing. The continuation supplied those missing files and optimized assets without rebuilding the existing shell.

## Inspection and measurements

The frame, nested layout, styled text segments, variables, fills, effects, crops, component instances, and reactions were inspected. `figma/structure.xml.txt` references the current file’s node IDs. Reference code in the context files is inspection evidence, not application source.

| Measurement | Figma / implementation |
| --- | --- |
| Desktop frame | 1440 × 3977 |
| Background | #fafafa |
| Page padding | 120 top, 60 bottom |
| Profile | x=450, y=120, width=540, height=949 |
| Section spacing | 40 |
| Body type | Inter 400, 14 px / 21 px, −0.07 px tracking |
| Paragraph gap | 14 |
| Work and PR row gap | 7 |
| Divider | y=1109, width=540 |
| Mode toggle | x=633.5, y=1149, 173 × 33 |
| Showcase list | x=370, y=1222, 700 × 2634 |
| Artwork area | 700 × 450 |
| Card radius / gap | 16 / 20 |
| Control area | 60 px first card; 61 px remaining cards |
| Footer | x=370, y=3896, 700 × 21 |

Inter 3.19 Regular and Medium are self-hosted from the official `rsms/inter` release, with its license. The implementation uses the weights and upright style specified by Figma. No extra animation, icon, or UI library was installed.

## Current Static implementation (updated 2026-09-28)

The latest request supersedes the original exported-image architecture. All five Static compositions now use existing React components, HTML/CSS, real text, and isolated Figma SVG icons. Only photos and the original fine raster texture use raster assets. The illustrations are inert to preserve the specific designed state; the coded shell, mode tabs, links, and ruler checkboxes remain interactive. Interaction intentionally renders no cards or empty-state message.

| Study | Current artwork node | Component | Rulers: vertical / horizontal, in 700 × 450 coordinates |
| --- | --- | --- | --- |
| Calendar and reminder | 4953:30 | DatePickerDemo | 131, 558 / 111, 225 |
| Voice chat | 4941:381 | VoiceChatDemo | 246, 454 / 154 |
| Product navigation | 4941:449 | NavigationDemo | 94 / 55.65, 151 |
| Prompt composer | 4941:531 | ComposerDemo | 149, 155, 243, 249 / 340 |
| Agent selector | 4941:587 | AgentSelectorDemo | 137, 145, 563 / 343 |

`RulerOverlay.tsx` measures actual content anchors and converts viewport geometry into the composition coordinate system. ResizeObserver and canvas-style observation keep the guides aligned during responsive scaling. Lines are solid #ff0000 at 0.5 design pixels, have no labels, never intercept pointer events, and are fully unmounted when off. All five checkboxes start unchecked. Checkbox dimensions, inset border, shadows, typography, and row alignment come from the updated Figma controls.

The latest calendar reminder is positioned at x=334.5, y=76. The original duplicate “29” label and decorative hand cursors are retained in the Static artwork. The original isolated orb SVGs replace the older raster icons.

Each Figma panel's individual effects were reread via MCP: layered negative-spread drop shadows, fractional inset highlights and borders, dark menu surfaces, and glass backgrounds. No universal replacement shadow was applied. Exact inspected effect data is retained in `figma/polish/effects.json`.

Social hover changes only the 16 px SVG icon color from #9f9f9f to black; separator paths and spacing are unchanged. Inactive mode tabs keep a transparent background and change text to #4a4a4a. Active pill geometry and effects remain as inspected.

Text links use a 1 px #e4e4e4 track and black foreground line. Both hover directions are anchored left. Frame sampling of the supplied video was used to fit a 380 ms cubic-bezier(.22, 1, .36, 1) transition; this timing is inferred from the recording, not Figma motion metadata. Flex-row links avoid extra padding so the exact preexisting page geometry remains unchanged.

## Assets and performance

Former full-composition WebP outputs are archived in `figma/retired-production/`, outside production. The asset script now processes only genuine photo assets. SVG/text/CSS remain sharp at high pixel density without loading large screenshots. Fonts and the optimized avatar are unchanged; no dependencies, API services, or animation libraries were added.

## Verification

`npm run build` and all 49 production-browser assertions pass with no console errors or failed asset requests. The updated browser QA covers preserved 1440 px geometry, all five coded compositions, no retired image downloads, icon/text/tab hover behavior, zero link movement, initial ruler state, exact per-card ruler coordinates, independent toggles, keyboard focus, empty Interaction, no reloads, and responsive alignment at 320/390/768 px. Captures use DPR 2; screenshots and the report are in `artifacts/qa/`.

Visual comparison used newly inspected MCP node screenshots and the supplied active-ruler reference. A first QA pass caught a 3 px increase in each work-row height from the new link padding; this was corrected before the final checks. The full desktop shell again matches the original 1440 × 3977 geometry.

## Destination links

Figma text hyperlinks and prototype links are empty for the studio, social icons, and project rows. Mustofa subsequently supplied all 15 external destinations, which are now configured in `src/content.ts`. The existing text and social icon links are active, with their labels and styling preserved. Email and Selected work navigation remain active.

## Latest correction pass — 2026-09-28

Re-read current nodes through MCP rather than reusing the previous measurements. Latest raw reads are `figma/polish/updated-nodes.json` and `updated-voice.json`.

- Ruler overlays now stay mounted with visibility toggled. Checkbox dimensions remain 21 × 21 in both states: the previous 21→20 px switch was moving the centered label. Six repeated toggles per card preserve every child/control rectangle and document scroll dimensions exactly.
- All outer cards use the latest 0.5 px inside black stroke at 10% opacity, radius 16, two drop shadows (0, 0.5, blur 2, 4% black) and the two inspected inset effects. Control divider is 0.5 px at 10% black, painted without affecting layout.
- Interaction is a native disabled button, #919191 at full opacity, default cursor, no hover/pressed styling or keyboard activation. Static stays selected.
- Greeting is exactly “Hello, Ciao, 안녕하세요, Hai, こんにちは”, Inter Regular 14 / 21, −0.07 px, #9f9f9f.
- Calendar node 4953:93 has its own fill hidden. Its shared parent 4953:90 supplies #f4f5f5 over the entire 114 × 38 range, radius 8. This continuous background now extends behind the rounded 15 and 17 endpoints rather than looking like a separate gray square.
- Voice modal is 241 × 255 at (229.5, 135.5), with an explicit 0.5 px inside stroke. Children retain 240 px content width and their original positions via a 0.5 px inset. Header 36, participant area 170, footer 48; six 40 px avatars, 16 px spacing, 4 px label gaps, 208 × 32 CTA. Latest badge effects use actual negative shadow spreads instead of a chain of drop-shadow filters. Original participant assets/crops remain unchanged.
- Production build and 51 browser assertions pass. Separate DPR 2 image comparisons find zero changed artwork pixels outside the ruler lines on all five cards. Desktop and 320/390/768 px responsive captures were reviewed; social and underline hover checks remain passing.

This entry supersedes the earlier notes about empty Interaction, unmounted rulers, and prior card stroke values.
