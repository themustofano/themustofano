import { BorderBeam } from 'border-beam';
import { useState, useSyncExternalStore, type SyntheticEvent } from 'react';
import { Icon } from '../demos/shared';

export type MenuId = 'products' | 'resources';
type Entry = { id: string; name: string; description: string; neutral: string; active: string };

const products: Entry[] = [
  { id: 'ai-agent', name: 'AI Agent', description: 'Resolve conversations automatically', neutral: 'interaction-header/ai-agent-neutral.svg', active: 'interaction-header/ai-agent.svg' },
  { id: 'knowledge-base', name: 'Knowledge Base', description: 'Turn docs into answers', neutral: 'nav-feeb5.svg', active: 'interaction-header/knowledge-base-active.svg' },
  { id: 'workflow-builder', name: 'Workflow Builder', description: 'Automate support workflows', neutral: 'nav-1d5a7.svg', active: 'interaction-header/workflow-builder-active.svg' },
  { id: 'analytics', name: 'Analytics', description: 'Track support performance', neutral: 'nav-29d7f.svg', active: 'interaction-header/analytics-active.svg' },
];
const resources: Entry[] = [
  { id: 'guides', name: 'Guides', description: 'Practical tips to get more done', neutral: 'interaction-header/guides.svg', active: 'interaction-header/guides-active.svg' },
  { id: 'customer-stories', name: 'Customer Stories', description: 'See how teams use our platform', neutral: 'interaction-header/customer-stories.svg', active: 'interaction-header/customer-stories-active.svg' },
  { id: 'blog', name: 'Blog', description: 'Ideas, insights, and product news', neutral: 'interaction-header/blog.svg', active: 'interaction-header/blog-active.svg' },
  { id: 'templates', name: 'Templates', description: 'Ready-to-use workflows for your team', neutral: 'interaction-header/templates.svg', active: 'interaction-header/templates-active.svg' },
];
const productUtilities = [
  ['API Documentation', 'nav-966f8.svg'], ['Help Center', 'nav-463a9.svg'], ['Product Updates', 'nav-e51a5.svg'],
] as const;
const resourceUtilities = [
  ['Help Center', 'nav-463a9.svg'], ['Community', 'interaction-header/community.svg'], ['Events & Webinars', 'interaction-header/events-webinars.svg'],
] as const;

function subscribeToReducedMotion(change: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', change);
  return () => query.removeEventListener('change', change);
}

function HeaderEntry({ entry, onChoose }: { entry: Entry; onChoose: () => void }) {
  const [interacting, setInteracting] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);
  function syncInteraction(event: SyntheticEvent<HTMLButtonElement>) {
    setInteracting(event.currentTarget.matches(':hover, :focus-visible'));
  }
  return <button type="button" role="menuitem" onPointerEnter={syncInteraction} onPointerLeave={syncInteraction}
    onPointerDown={syncInteraction} onFocus={syncInteraction} onBlur={syncInteraction}
    onKeyDown={syncInteraction} onKeyUp={syncInteraction} onClick={onChoose}>
    <BorderBeam className="interaction-icon-beam" size="sm" colorVariant="colorful" strength={0.6} duration={1.96}
      active={interacting && !reducedMotion} theme="dark" borderRadius={6} aria-hidden="true">
      <span className="product-icon" aria-hidden="true">
        <img className="interaction-neutral-icon" src={`/assets/${entry.neutral}`} alt="" width="18" height="18" />
        <img className="interaction-active-icon" src={`/assets/${entry.active}`} alt="" width="18" height="18" />
      </span>
    </BorderBeam>
    <span><strong>{entry.name}</strong><span>{entry.description}</span></span>
  </button>;
}

export function InteractionHeaderContent({ menu, onNavigate }: { menu: MenuId; onNavigate: () => void }) {
  const entries = menu === 'products' ? products : resources;
  const utilities = menu === 'products' ? productUtilities : resourceUtilities;
  return <div className="interaction-menu-content">
    <div className="product-grid">{entries.map(entry => <HeaderEntry key={entry.id} entry={entry} onChoose={onNavigate} />)}</div>
    <div className="resource-links">{utilities.map(([name, icon]) => <button type="button" role="menuitem" key={name}
      onClick={onNavigate}><Icon file={icon} size={10.5} />{name}</button>)}</div>
  </div>;
}
