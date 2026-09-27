import { useRef, useState } from 'react';
import { DemoCanvas, Icon } from './shared';

const names = ['Selena', 'Maria', 'Pierre', 'Noah', 'Parker', 'John'];
function Avatar({ name }: { name: string }) { return <span className={`participant-image participant-${name.toLowerCase()}`}><img src={`/assets/participant-${name.toLowerCase()}.webp`} alt="" width={40} height={40} /></span>; }

export function VoiceChatDemo() {
  const [open, setOpen] = useState(true), [joined, setJoined] = useState(false), [muted, setMuted] = useState(false);
  const [speakers, setSpeakers] = useState(['Selena', 'John']);
  const trigger = useRef<HTMLButtonElement>(null);
  return <DemoCanvas label="Static voice chat"><div className="voice-demo" onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } }}>
    <button className="participant-stack soft-panel" ref={trigger} aria-label={open ? 'Collapse voice chat' : 'Open voice chat'} aria-expanded={open} aria-controls="voice-chat-panel" onClick={() => setOpen(!open)}>
      {names.slice(0, 4).map(name => <Avatar name={name} key={name} />)}<span className="more-participants">+3</span>
    </button>
    <button className="speaker-badge stack-speaker" aria-label={muted ? 'Unmute voice chat' : 'Mute voice chat'} aria-pressed={muted} onClick={() => setMuted(!muted)}><Icon file="voice-06943.svg" size={16} />{muted && <span className="mute-slash" />}</button>
    {open && <div id="voice-chat-panel" className="voice-panel soft-panel">
      <div className="voice-header">Voice chat<button aria-label="Close voice chat" onClick={() => { setOpen(false); trigger.current?.focus(); }}><Icon file="voice-7ab33.svg" size={12} /></button></div>
      <div className="participants">{names.map(name => <button className="participant" key={name} aria-label={`Toggle ${name}'s speaking indicator`} aria-pressed={speakers.includes(name)} onClick={() => setSpeakers(speakers.includes(name) ? speakers.filter(n => n !== name) : [...speakers, name])}>
        <Avatar name={name} /><span>{name}</span>{speakers.includes(name) && !muted && <span className="speaker-badge"><Icon file="voice-4b2d3.svg" size={12} /></span>}
      </button>)}</div>
      <div className="voice-footer"><button className="dark-button" aria-pressed={joined} onClick={() => setJoined(!joined)}>{joined ? 'Leave chat' : 'Join now'}</button></div>
    </div>}
    <span className="sr-only" role="status">{joined ? 'Joined the local voice chat demo.' : 'Voice chat demo, not connected.'} {muted ? 'Muted.' : ''}</span>
  </div></DemoCanvas>;
}
