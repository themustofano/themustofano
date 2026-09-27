import { useEffect, useState, type RefObject } from 'react';
import type { ShowcaseId } from './content';

type Anchor = { selector: string; edge: 'left' | 'right' | 'top' | 'centerX' | 'centerY'; inset?: 'paddingLeft'; offset?: number };
const guides: Record<ShowcaseId, Anchor[]> = {
  date: [
    { selector: '.date-presets button', edge: 'left', inset: 'paddingLeft' },
    { selector: '[aria-label="Next month"]', edge: 'centerX' },
    { selector: '.date-presets button', edge: 'centerY' },
    { selector: '.calendar-grid .range-end', edge: 'centerY' },
  ],
  voice: [
    { selector: '.voice-footer button', edge: 'left' },
    { selector: '.voice-footer button', edge: 'right' },
    { selector: '.voice-header', edge: 'centerY' },
  ],
  nav: [
    { selector: '.product-icon', edge: 'left' },
    { selector: '.product-grid', edge: 'top', offset: .4 },
    { selector: '.product-grid button:nth-child(2)', edge: 'top', offset: 31.75 },
  ],
  composer: [
    { selector: '.prompt-input', edge: 'left', inset: 'paddingLeft' },
    { selector: '.composer-chip img', edge: 'left' },
    { selector: '.aspect-menu', edge: 'left', inset: 'paddingLeft' },
    { selector: '.aspect-menu p', edge: 'left', inset: 'paddingLeft' },
    { selector: '.composer-actions .send-button', edge: 'centerY' },
  ],
  agent: [
    { selector: '.agent-chip', edge: 'left' },
    { selector: '.agent-menu p', edge: 'left', inset: 'paddingLeft' },
    { selector: '.agent-model', edge: 'right' },
    { selector: '.agent-model', edge: 'centerY' },
  ],
};

// Guide anchors follow the rendered elements, including the canvas's responsive scale.
export function RulerOverlay({ id, artboard, visible }: { id: ShowcaseId; visible: boolean; artboard: RefObject<HTMLDivElement | null> }) {
  const [lines, setLines] = useState<{ vertical: boolean; position: number }[]>([]);
  // The parent artboard ref is attached after child layout effects finish.
  useEffect(() => {
    const board = artboard.current;
    const content = board?.querySelector('.coded-artwork');
    if (!board || !content) return;
    let frame = 0;
    const measure = () => {
      const bounds = board.getBoundingClientRect(), scale = bounds.width / 700;
      setLines(guides[id].flatMap(anchor => {
        const element = content.querySelector(anchor.selector);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        const vertical = ['left', 'right', 'centerX'].includes(anchor.edge);
        const value = anchor.edge === 'centerX' ? rect.left + rect.width / 2
          : anchor.edge === 'centerY' ? rect.top + rect.height / 2 : rect[anchor.edge];
        const inset = anchor.inset ? parseFloat(getComputedStyle(element)[anchor.inset]) : 0;
        return [{ vertical, position: (value - (vertical ? bounds.left : bounds.top)) / scale + inset + (anchor.offset ?? 0) }];
      }));
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    const mutation = new MutationObserver(schedule);
    resize.observe(board);
    mutation.observe(content, { subtree: true, attributes: true, attributeFilter: ['style'] });
    measure();
    return () => { resize.disconnect(); mutation.disconnect(); cancelAnimationFrame(frame); };
  }, [id, artboard]);
  return <svg className="ruler-overlay" viewBox="0 0 700 450" aria-hidden="true" style={{ visibility: visible ? 'visible' : 'hidden' }}>
    {lines.map(({ vertical, position }, i) => <line key={i} x1={vertical ? position : 0} x2={vertical ? position : 700} y1={vertical ? 0 : position} y2={vertical ? 450 : position} />)}
  </svg>;
}
