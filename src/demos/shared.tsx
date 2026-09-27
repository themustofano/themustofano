import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type KeyboardEvent, type RefObject } from 'react';

export const StaticPresentation = createContext(false);

export function Icon({ file, size = 14 }: { file: string; size?: number }) {
  return <img src={`/assets/${file}`} alt="" width={size} height={size} draggable={false} />;
}

export function DemoCanvas({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const parent = ref.current!.parentElement!;
    setScale(parent.getBoundingClientRect().width / 700);
    const observer = new ResizeObserver(entries => setScale(entries[0].contentRect.width / 700));
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);
  return <div className="demo-canvas" ref={ref} role="group" aria-label={label} style={{ transform: `scale(${scale})` }}>{children}</div>;
}

export function useDismiss(ref: RefObject<HTMLElement | null>, close: () => void) {
  const presentation = useContext(StaticPresentation);
  const callback = useRef(close);
  callback.current = close;
  useEffect(() => {
    if (presentation) return;
    const onPointer = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) callback.current(); };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [ref, presentation]);
}

export function menuKeys(event: KeyboardEvent<HTMLElement>) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role^="menuitem"], [role="option"]')];
  const index = options.indexOf(document.activeElement as HTMLButtonElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
  event.preventDefault(); options[next]?.focus();
}

export function DesignCursor({ x, y }: { x: number; y: number }) {
  return <span className="design-cursor" aria-hidden="true" style={{ left: x, top: y }}><img src="/assets/cursor-hand.svg" alt="" /></span>;
}
