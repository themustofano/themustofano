import type { ShowcaseId } from './content';

// Figma 4941:161: guide coordinates within each 700 × 450 artboard.
// The SVG uses the same reference size as DemoCanvas, including on mobile.
const guides: Record<ShowcaseId, { vertical: number[]; horizontal: number[] }> = {
  date: { vertical: [123, 131, 287, 558], horizontal: [111, 225] },
  voice: { vertical: [246, 454], horizontal: [154, 188, 374] },
  nav: { vertical: [94, 136, 410], horizontal: [55.65, 151] },
  composer: { vertical: [149, 155, 243, 249, 269, 275], horizontal: [340] },
  agent: { vertical: [137, 145, 167, 563], horizontal: [293, 343] },
};

export function RulerOverlay({ id, visible }: { id: ShowcaseId; visible: boolean }) {
  return <svg className="ruler-overlay" viewBox="0 0 700 450" aria-hidden="true" style={{ visibility: visible ? 'visible' : 'hidden' }}>
    {guides[id].vertical.map(x => <line key={`x-${x}`} x1={x} x2={x} y1={0} y2={450} />)}
    {guides[id].horizontal.map(y => <line key={`y-${y}`} x1={0} x2={700} y1={y} y2={y} />)}
  </svg>;
}
