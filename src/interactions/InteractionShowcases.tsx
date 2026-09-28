import { type ReactNode } from 'react';
import { DemoCanvas } from '../demos/shared';
import { InteractionDatePicker } from './date/InteractionDatePicker';
import { InteractionHeader } from './InteractionHeader';
import { InteractionProfile } from './profile/InteractionProfile';
import './date/date-picker.css';
import './profile/profile.css';
import './interaction.css';

function InteractionCard({ label, dark = false, children }: { label: string; dark?: boolean; children: ReactNode }) {
  return <article className={`showcase-card interaction-card ${label === 'Date Picker' ? 'first-card' : ''}`}
    aria-label={`${label} interaction`} data-interaction={label.toLowerCase().replace(' ', '-')}>
    <div className={`artboard ${dark ? 'dark-artboard' : ''}`}>{children}</div>
    <div className="card-controls"><span className="interaction-card-label">{label}</span></div>
  </article>;
}

export default function InteractionShowcases() {
  return <>
    <InteractionCard label="Date Picker">
      <DemoCanvas label="Interactive date picker"><InteractionDatePicker /></DemoCanvas>
    </InteractionCard>
    <InteractionCard label="Header" dark><InteractionHeader /></InteractionCard>
    <InteractionCard label="Profile" dark><InteractionProfile /></InteractionCard>
  </>;
}
