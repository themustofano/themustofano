import { useImperativeHandle, useLayoutEffect, useRef, useState, useSyncExternalStore, type Ref } from 'react';
import { InteractionHeaderContent, type MenuId } from './InteractionHeaderContent';

interface Props {
  ref: Ref<HTMLDivElement>;
  activeMenu: MenuId | null;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onNavigate: (menu: MenuId) => void;
}

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
interface Presentation {
  active: MenuId | null;
  reduced: boolean;
  layers: MenuId[];
  switching: boolean;
  revision: number;
}

// The shared, measured shell and retained outgoing layers follow expore-17's
// SharedMenuShell. Only the inner artwork uses the portfolio's approved scale.
export function InteractionMenuShell({ ref, activeMenu, onPointerEnter, onPointerLeave, onNavigate }: Props) {
  const reducedMotion = useSyncExternalStore(subscribeToMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const gridSurfaceRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef(new Map<MenuId, HTMLDivElement>());
  const previousMenu = useRef<MenuId | null>(null);
  const [presentation, setPresentation] = useState<Presentation>({
    active: activeMenu, reduced: reducedMotion, layers: activeMenu ? [activeMenu] : [], switching: false, revision: 0,
  });

  if (presentation.active !== activeMenu || presentation.reduced !== reducedMotion) {
    setPresentation({
      active: activeMenu,
      reduced: reducedMotion,
      layers: reducedMotion ? (activeMenu ? [activeMenu] : []) : activeMenu
        ? [...new Set([...presentation.layers, activeMenu])] : presentation.layers,
      switching: !!activeMenu && !!presentation.active,
      revision: presentation.revision + 1,
    });
  }

  useImperativeHandle(ref, () => shellRef.current!, []);

  useLayoutEffect(() => {
    const anchor = anchorRef.current!;
    const shell = shellRef.current!;
    const measure = () => {
      shell.style.setProperty('--interaction-menu-content-width', `${anchor.clientWidth}px`);
      if (!activeMenu) return;
      const content = layerRefs.current.get(activeMenu)?.firstElementChild as HTMLElement | null;
      if (!content) return;
      shell.style.width = `${content.offsetWidth}px`;
      shell.style.height = `${content.offsetHeight}px`;
      const grid = content.querySelector<HTMLElement>('.product-grid');
      if (grid) gridSurfaceRef.current!.style.height = `${grid.offsetHeight}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    for (const layer of layerRefs.current.values()) {
      if (layer.firstElementChild) observer.observe(layer.firstElementChild);
    }
    return () => observer.disconnect();
  }, [activeMenu, presentation.layers]);

  useLayoutEffect(() => {
    const wasOpen = previousMenu.current !== null;
    previousMenu.current = activeMenu;
    const revision = presentation.revision;
    const immediate = reducedMotion || !wasOpen;
    if (activeMenu) {
      void shellRef.current!.offsetWidth;
      for (const [menu, layer] of layerRefs.current) {
        if (immediate) layer.style.setProperty('transition', 'none');
        layer.style.setProperty('transform', menu === activeMenu ? 'translateX(0px)' : `translateX(${menu === 'products' ? -200 : 200}px)`);
        layer.style.setProperty('opacity', menu === activeMenu ? '1' : '0');
        layer.style.setProperty('filter', menu === activeMenu ? 'blur(0px)' : 'blur(8px)');
      }
      if (immediate) {
        void shellRef.current!.offsetWidth;
        for (const layer of layerRefs.current.values()) layer.style.removeProperty('transition');
      }
    }
    const timer = window.setTimeout(() => {
      setPresentation(current => current.revision === revision
        ? { ...current, layers: activeMenu ? [activeMenu] : [] } : current);
    }, reducedMotion ? 0 : activeMenu ? 250 : 120);
    return () => window.clearTimeout(timer);
  }, [activeMenu, presentation.revision, reducedMotion]);

  return <div className="interaction-navigation-anchor" ref={anchorRef}>
    <div ref={shellRef} className="interaction-navigation-shell" data-open={activeMenu !== null}
      data-switching={presentation.switching && !reducedMotion} aria-hidden={activeMenu === null}
      inert={activeMenu === null} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <div className="interaction-navigation-viewport">
        <div className="interaction-navigation-grid-surface" ref={gridSurfaceRef} aria-hidden="true" />
        {presentation.layers.map(menu => <div key={menu}
          ref={element => { if (element) layerRefs.current.set(menu, element); else layerRefs.current.delete(menu); }}
          id={`interaction-${menu}-dropdown`} className="interaction-navigation-layer"
          data-menu={menu} data-active={menu === activeMenu} role="dialog"
          aria-labelledby={`interaction-${menu}-trigger`} aria-hidden={menu !== activeMenu} inert={menu !== activeMenu}
          onTransitionEnd={event => {
            if (!activeMenu || event.target !== event.currentTarget || event.propertyName !== 'transform' || menu === activeMenu) return;
            const revision = presentation.revision;
            setPresentation(current => current.revision === revision && current.active !== menu
              ? { ...current, layers: current.layers.filter(layer => layer !== menu) } : current);
          }}>
          <InteractionHeaderContent menu={menu} onNavigate={() => onNavigate(menu)} />
        </div>)}
      </div>
    </div>
  </div>;
}
