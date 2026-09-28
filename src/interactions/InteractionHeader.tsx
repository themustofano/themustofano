import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { DemoCanvas } from '../demos/shared';
import { InteractionMenuShell } from './InteractionMenuShell';
import type { MenuId } from './InteractionHeaderContent';

const menus = [{ id: 'products', label: 'Products' }, { id: 'resources', label: 'Resources' }] as const;

// expore-17 HeaderNav's disclosure and focus state machine, attached to the
// portfolio's existing navigation artwork.
export function InteractionHeader() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const activeMenu = useRef<MenuId | null>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const shell = useRef<HTMLDivElement>(null);
  const customer = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFrame = useRef<number | null>(null);

  function getPanel(menu: MenuId) { return shell.current?.querySelector<HTMLDivElement>(`#interaction-${menu}-dropdown`); }
  function getItems(menu: MenuId) {
    return Array.from(getPanel(menu)?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
      .filter(item => !item.closest('[inert]'));
  }
  function cancelClose() {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }
  function cancelPendingFocus() {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  }
  function closeMenu(menu: MenuId) {
    if (activeMenu.current !== menu) return;
    cancelClose(); cancelPendingFocus();
    activeMenu.current = null; setOpenMenu(null);
  }
  function showMenu(menu: MenuId) {
    cancelClose();
    if (activeMenu.current === menu) return;
    cancelPendingFocus();
    const previous = activeMenu.current;
    const focusWasInside = previous && getPanel(previous)?.contains(document.activeElement);
    activeMenu.current = menu; setOpenMenu(menu);
    if (focusWasInside) triggers.current[menu]?.focus();
  }
  function scheduleClose(menu: MenuId) {
    if (activeMenu.current !== menu) return;
    cancelClose();
    if (getPanel(menu)?.contains(document.activeElement)) return;
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      if (!getPanel(menu)?.contains(document.activeElement)) closeMenu(menu);
    }, 150);
  }
  function focusFirstItem(menu: MenuId) {
    showMenu(menu); cancelPendingFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      if (activeMenu.current === menu) getItems(menu)[0]?.focus();
    });
  }
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const menu = activeMenu.current;
    if (!menu) return;
    const panel = getPanel(menu);
    const isTrigger = Object.values(triggers.current).some(control => control === (event.target as EventTarget));
    if (!isTrigger && !panel?.contains(event.target)) return;
    const next = event.relatedTarget;
    if (next instanceof Node && (panel?.contains(next)
      || Object.values(triggers.current).some(control => control === next))) return;
    closeMenu(menu);
  }
  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    const trigger = menus.find(({ id }) => triggers.current[id] === event.target)?.id;
    if (event.key === 'ArrowDown' && trigger) {
      event.preventDefault(); focusFirstItem(trigger); return;
    }
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
    const menu = activeMenu.current;
    if (!menu) return;
    const items = getItems(menu);
    if (!items.length) return;
    if (!event.shiftKey && event.target === triggers.current[menu]) {
      event.preventDefault(); items[0].focus();
    } else if (event.shiftKey && event.target === items[0]) {
      event.preventDefault(); triggers.current[menu]?.focus();
    } else if (!event.shiftKey && event.target === items[items.length - 1]) {
      const next = menu === 'products' ? triggers.current.resources : customer.current;
      if (next) { event.preventDefault(); closeMenu(menu); next.focus(); }
    }
  }

  useEffect(() => {
    function dismiss() {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      closeTimer.current = null; focusFrame.current = null;
      activeMenu.current = null; setOpenMenu(null);
    }
    function outside(event: PointerEvent) {
      if (!activeMenu.current) return;
      const target = event.target;
      if (target instanceof Node && !shell.current?.contains(target)
        && !Object.values(triggers.current).some(trigger => trigger?.contains(target))) dismiss();
    }
    function escape(event: globalThis.KeyboardEvent) {
      const menu = activeMenu.current;
      if (event.key !== 'Escape' || !menu) return;
      const focusIsInside = getPanel(menu)?.contains(document.activeElement);
      dismiss();
      if (focusIsInside) triggers.current[menu]?.focus();
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    };
  }, []);

  return <DemoCanvas label="Interactive header">
    <div className="navigation-demo interaction-header-artwork" onBlur={handleBlur} onKeyDown={handleKeys}
      onFocus={event => {
        const menu = activeMenu.current;
        if (menu && ((event.target as EventTarget) === triggers.current[menu] || getPanel(menu)?.contains(event.target))) cancelClose();
      }}>
      <nav className="demo-nav" aria-label="Demo navigation">
        {menus.map(({ id, label }) => <button key={id}
          ref={node => { triggers.current[id] = node; }} type="button" id={`interaction-${id}-trigger`}
          className={openMenu === id ? 'active' : ''} aria-expanded={openMenu === id}
          aria-haspopup="dialog" aria-controls={`interaction-${id}-dropdown`}
          onPointerEnter={event => { if (event.pointerType === 'mouse') showMenu(id); }}
          onPointerLeave={() => scheduleClose(id)}
          onClick={() => {
            if (activeMenu.current === id) {
              if (getPanel(id)?.contains(document.activeElement)) triggers.current[id]?.focus();
              closeMenu(id);
            } else showMenu(id);
          }}>{label}</button>)}
        <button ref={customer} type="button">Customer</button>
        <button type="button">Pricing</button>
      </nav>
      <InteractionMenuShell ref={shell} activeMenu={openMenu} onPointerEnter={cancelClose}
        onPointerLeave={() => { if (activeMenu.current) scheduleClose(activeMenu.current); }}
        onNavigate={menu => {
          if (activeMenu.current !== menu) return;
          triggers.current[menu]?.focus(); closeMenu(menu);
        }} />
    </div>
  </DemoCanvas>;
}
