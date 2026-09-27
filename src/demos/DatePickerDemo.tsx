import { useRef, useState } from 'react';
import { DemoCanvas, Icon, useDismiss } from './shared';

const DAY = 86400000;
const reference = new Date(2026, 8, 17).getTime();
const presets = [['Today', 1], ['Yesterday', 0], ['Last 3 days', 3], ['Last 7 days', 7], ['Last 14 days', 14], ['Last 30 days', 30], ['Last 90 days', 90]] as const;
const dateLabel = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function DatePickerDemo() {
  const [month, setMonth] = useState(new Date(2026, 8, 1));
  const [range, setRange] = useState([reference - 2 * DAY, reference]);
  const [preset, setPreset] = useState('Last 3 days');
  const [open, setOpen] = useState(true);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [status, setStatus] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const lastDay = useRef<HTMLButtonElement | null>(null);
  useDismiss(root, () => setOpen(false));
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
  const days = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  return <DemoCanvas label="Static date picker"><div ref={root} className="date-demo" onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); lastDay.current?.focus(); } }}>
    <div className="calendar-panel soft-panel">
      <div className="date-presets" aria-label="Date presets">{presets.map(([label, count]) => <button key={label} aria-pressed={preset === label} onClick={() => {
        const end = count === 0 ? reference - DAY : reference;
        setRange([end - (Math.max(count, 1) - 1) * DAY, end]); setPreset(label); setMonth(new Date(2026, 8, 1)); setOpen(false);
      }}>{label}</button>)}</div>
      <div className="calendar">
        <div className="calendar-header">
          <button aria-label="Previous month" onClick={() => { setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)); setOpen(false); }}><Icon file="date-9988e.svg" size={16} /></button>
          <span aria-live="polite">{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button aria-label="Next month" onClick={() => { setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)); setOpen(false); }}><Icon file="date-f21f6.svg" size={16} /></button>
        </div>
        <div className="calendar-grid" role="group" aria-label="Calendar dates">{days.map((day, i) => {
          const value = day.getTime(), selected = value >= range[0] && value <= range[1], endpoint = value === range[0] || value === range[1];
          return <button key={value} className={`${day.getDay() === 0 || day.getDay() === 6 ? 'weekend' : ''} ${day.getMonth() !== month.getMonth() ? 'other-month' : ''} ${selected ? 'in-range' : ''} ${endpoint ? 'range-end' : ''}`} aria-label={dateLabel(day) + (notes[value] ? ', has note' : '')} aria-pressed={selected} tabIndex={value === range[1] || (!days.some(d => d.getTime() === range[1]) && i === 0) ? 0 : -1} onKeyDown={e => {
            const offset = ({ ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 } as Record<string, number>)[e.key];
            if (offset) { e.preventDefault(); const target = e.currentTarget.parentElement?.children[i + offset] as HTMLButtonElement | undefined; target?.focus(); }
          }} onClick={e => { lastDay.current = e.currentTarget; setRange(e.shiftKey ? [Math.min(range[0], value), Math.max(range[0], value)] : [value, value]); setPreset(''); setNote(notes[value] || ''); setOpen(true); }}>
            {day.getMonth() === 8 && day.getDate() === 28 ? 29 : day.getDate()}{notes[value] && <span className="note-dot" />}
          </button>;
        })}</div>
      </div>
    </div>
    {open && <form className="note-popover glass-panel" aria-label="Date note" onSubmit={e => { e.preventDefault(); if (!note.trim()) return; setNotes({ ...notes, [range[1]]: note.trim() }); setStatus(`Note saved for ${dateLabel(new Date(range[1]))}`); setOpen(false); lastDay.current?.focus(); }}>
      <textarea aria-label="Add note or reminder" placeholder="|Add note or reminder..." value={note} onChange={e => setNote(e.target.value)} />
      <button type="submit" className="glass-button" disabled={!note.trim()}>Add note</button>
    </form>}
    <span className="sr-only" role="status">{status}</span>
  </div></DemoCanvas>;
}
