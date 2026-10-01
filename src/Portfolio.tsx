import { useEffect, useState, type ReactNode } from 'react';
import { links, records, showcases, work } from './content';

import StaticShowcases from './demos/StaticShowcases';
import InteractionShowcases from './interactions/InteractionShowcases';
import { RulerOverlay } from './RulerOverlay';

function TextLink({ name, children }: { name: string; children: ReactNode }) {
  const href = links[name];
  const external = href?.startsWith('https://') || href?.startsWith('http://');
  return href ? <a className="text-link" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={name === 'selectedWork' ? event => {
    event.preventDefault();
    const section = document.querySelector<HTMLElement>('.selected-work-section');
    const navigation = section?.querySelector<HTMLElement>('.showcase-navigation');
    if (!section || !navigation) return;
    const gap = Number.parseFloat(getComputedStyle(section).rowGap);
    const stickyTop = Number.parseFloat(getComputedStyle(navigation).top);
    const landingTop = Math.max(gap, stickyTop);
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top - landingTop,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  } : undefined}>{children}</a> : <span className="link-text">{children}</span>;
}

function Intro() {
  return <div className="profile">
    <header className="profile-header">
      <img className="avatar" src="/assets/avatar.webp" width="40" height="40" alt="Mustofa" fetchPriority="high" />
      <div className="socials">
        <svg width="80.7102" height="16" viewBox="0 0 80.7102 16" aria-hidden="true" fill="#e4e4e4">
          <path d="M26.3551 1.90483L23.0739 14.0952H22L25.2812 1.90483H26.3551Z" />
          <path d="M58.7102 1.90483L55.429 14.0952H54.3551L57.6364 1.90483H58.7102Z" />
        </svg>
        {['X', 'Dribbble', 'Instagram'].map((name, i) => links[name] && <a key={name} href={links[name]} target="_blank" rel="noopener noreferrer" aria-label={name} style={{ left: `${i * 32.35511398}px` }}><span className={`social-icon social-${name.toLowerCase()}`} /></a>)}
      </div>
    </header>
    <section className="intro" aria-label="About Mustofa">
      <p className="section-heading">Hello, Ciao, 안녕하세요, Hai, こんにちは</p>
      <div className="biography">
        <p>I’m Mustofa, a designer working across product, interaction, and visual design.</p>
        <p>I didn’t start out in design. I came from the F&amp;B industry, and over time found my way into this world. I’m now at <TextLink name="Blissful Studio">Blissful Studio</TextLink>, working with teams across different products, industries, and still learning as I go.</p>
        <p>Outside of work, I train weighted calisthenics and <span className="mobile-nowrap">enjoy running.</span></p>
        <p>Explore my <TextLink name="selectedWork">Selected work</TextLink>.</p>
      </div>
    </section>
    <section aria-labelledby="work-heading">
      <h2 id="work-heading" className="section-heading">Recent engagements</h2>
      <ul className="detail-rows">
        {work.map(([name, category, year]) => <li key={name} className={name === 'Echovane' ? 'echovane-row' : undefined}><TextLink name={name}>{name}</TextLink><span className="metadata">{category} <span className="slash">/</span> {year}</span></li>)}
      </ul>
    </section>
    <section aria-labelledby="pr-heading">
      <h2 id="pr-heading" className="section-heading">Calisthenics PRs</h2>
      <ul className="detail-rows">
        {records.map(([name, value], i) => <li className={i === 3 ? 'muted' : ''} key={name}><span>{name}</span><span className="metadata">{value}</span></li>)}
      </ul>
    </section>
    <section aria-labelledby="connect-heading">
      <h2 id="connect-heading" className="section-heading">Connect</h2>
      <p>I’m always happy to connect, whether it’s about work, design, or just something interesting. You can find me on <TextLink name="X">X (Twitter)</TextLink>, <TextLink name="Instagram">Instagram</TextLink>, and <TextLink name="LinkedIn">LinkedIn</TextLink>, or drop me a line at <TextLink name="email">themustofano@gmail.com</TextLink>.</p>
    </section>
  </div>;
}

export function ShowcaseCard({ item, children }: { item: typeof showcases[number]; children: ReactNode }) {
  const [rulers, setRulers] = useState(false);
  return <article className={`showcase-card ${item.id === 'date' ? 'first-card' : ''}`} aria-label={item.name} data-showcase={item.id}>
    <div className={`artboard ${item.id === 'nav' ? 'dark-artboard' : ''}`}>
      {children}
      <RulerOverlay id={item.id} visible={rulers} />
    </div>
    <div className="card-controls">
      <label>
        <input type="checkbox" checked={rulers} onChange={e => setRulers(e.target.checked)} aria-label={`Show Rulers — ${item.name}`} />
        <span>Show Rulers</span>
      </label>
    </div>
  </article>;
}

function Footer() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => { const id = window.setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  return <footer><span>Jakarta, Indonesia</span><span className="clock"><span>GMT+7</span><time dateTime={time.toISOString()}>{time.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour: 'numeric', minute: '2-digit', second: '2-digit' })}</time></span></footer>;
}

export function Portfolio() {
  const [mode, setMode] = useState<'static' | 'interaction'>('static');

  return <main className="portfolio">
    <h1 className="sr-only">Mustofa — Product, interaction, and visual design</h1>
    <Intro />
    <div className="profile-divider" />
    <section className="selected-work-section" aria-label="Selected work">
    <div className="showcase-navigation">
    <div id="selected-work" className="mode-toggle" data-mode={mode} role="tablist" aria-label="Showcase mode" onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'ArrowRight' || event.key === 'End' ? 'interaction' : 'static';
      setMode(next);
      event.currentTarget.querySelector<HTMLButtonElement>(`#${next}-tab`)?.focus();
    }}>
      <button id="static-tab" role="tab" aria-selected={mode === 'static'} aria-controls="showcase-panel"
        tabIndex={mode === 'static' ? 0 : -1} onClick={() => setMode('static')}>Static</button>
      <button id="interaction-tab" role="tab" aria-selected={mode === 'interaction'} aria-controls="showcase-panel"
        tabIndex={mode === 'interaction' ? 0 : -1} onClick={() => setMode('interaction')}>Interaction</button>
    </div>
    </div>
    <div id="showcase-panel" role="tabpanel" aria-labelledby={`${mode}-tab`} className="showcase-list">
      {mode === 'static' ? <StaticShowcases /> : <InteractionShowcases />}
    </div>
    </section>
    <Footer />
  </main>;
}
