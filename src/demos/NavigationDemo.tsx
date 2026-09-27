import { useRef, useState } from 'react';
import { DemoCanvas, Icon, menuKeys, useDismiss } from './shared';
const products = [
  ['AI Agent','Resolve conversations automatically','nav-27979.svg'],
  ['Knowledge Base','Turn docs into answers','nav-feeb5.svg'],
  ['Workflow Builder','Automate support workflows','nav-1d5a7.svg'],
  ['Analytics','Track support performance','nav-29d7f.svg'],
];
const resources = [['API Documentation','nav-966f8.svg'],['Help Center','nav-463a9.svg'],['Product Updates','nav-e51a5.svg']];
export function NavigationDemo() {
  const [open, setOpen] = useState(true), [active, setActive] = useState('Products'), [selected, setSelected] = useState('AI Agent');
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, () => setOpen(false));
  return <DemoCanvas label="Static product navigation"><div className="navigation-demo" ref={ref} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector<HTMLButtonElement>('.demo-nav button.active')?.focus(); } }}>
    <nav className="demo-nav" aria-label="Demo navigation">{['Products','Resources','Customer','Pricing'].map(label => <button key={label} className={active === label ? 'active' : ''} aria-expanded={label === 'Products' || label === 'Resources' ? active === label && open : undefined} aria-haspopup={label === 'Products' || label === 'Resources' ? 'menu' : undefined} onClick={() => { setActive(label); setOpen(label === 'Products' || label === 'Resources' ? active !== label || !open : false); }} onKeyDown={e => { if(e.key === 'ArrowDown' && (label === 'Products' || label === 'Resources')){e.preventDefault();setActive(label);setOpen(true);requestAnimationFrame(()=>ref.current?.querySelector<HTMLButtonElement>('[role=menuitem]')?.focus());} }}>{label}</button>)}</nav>
    {open && (active === 'Products' || active === 'Resources') && <div className="navigation-menu" role="menu" aria-label={`${active} menu`} onKeyDown={menuKeys}>
      {active === 'Products' && <div className="product-grid">{products.map(([name,description,icon]) => <button role="menuitem" className={selected === name ? 'chosen' : ''} key={name} onClick={() => setSelected(name)}>
        <span className="product-icon"><Icon file={icon} size={18} /></span><span><strong>{name}</strong><span>{description}</span></span>
      </button>)}</div>}
      <div className="resource-links">{resources.map(([name,icon]) => <button role="menuitem" key={name} onClick={() => { setSelected(name); setOpen(false); ref.current?.querySelector<HTMLButtonElement>('.demo-nav button.active')?.focus(); }}><Icon file={icon} size={10.5} />{name}</button>)}</div>
    </div>}
    <span role="status" className="sr-only">Selected {selected}</span>
  </div></DemoCanvas>;
}
