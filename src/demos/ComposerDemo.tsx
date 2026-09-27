import { useRef, useState } from 'react';
import { DemoCanvas, Icon, menuKeys, useDismiss } from './shared';

const ratios = ['Auto','1:1','4:3','3:5','16:9'];
export function ComposerDemo() {
  const [ratio,setRatio] = useState('16:9'), [open,setOpen] = useState(true), [text,setText] = useState('Find aesthetics in a similar direction');
  const [quality,setQuality] = useState(true), [attachment,setAttachment] = useState(''), [status,setStatus] = useState('');
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), file = useRef<HTMLInputElement>(null);
  useDismiss(root,()=>setOpen(false));
  return <DemoCanvas label="Static prompt composer"><div className="composer-demo" ref={root} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}}}>
    <form className="prompt-composer glass-panel" onSubmit={e=>{e.preventDefault();if(text.trim()){setStatus(`Prompt prepared locally: ${text}, ${ratio}, ${quality?'4K':'HD'}.`);setOpen(false);}}}>
      <input className="prompt-input" aria-label="Creative prompt" value={text} onChange={e=>setText(e.target.value)} />
      <div className="composer-options">
        <div className="composer-chips">
          <span className="composer-chip"><Icon file="composer-88650.svg" />GPT-5.5</span>
          <button type="button" className="composer-chip" ref={trigger} aria-label="Aspect ratio" aria-expanded={open} aria-haspopup="menu" aria-controls="aspect-ratio-menu" onClick={()=>setOpen(!open)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>('[role=menuitemradio]')?.focus());}}}><span className="ratio-icon wide" />{ratio}</button>
          <button type="button" className="composer-chip" aria-label="4K Render" aria-pressed={quality} onClick={()=>setQuality(!quality)}><Icon file="composer-5f044.svg" />{quality?'4K Render':'HD Render'}</button>
        </div>
        <div className="composer-actions"><button type="button" className="icon-button" aria-label="Attach image" onClick={()=>file.current?.click()}><Icon file="composer-bd3cb.svg" /></button><span className="attachment-name">{attachment}</span><button className="send-button" aria-label="Prepare prompt" disabled={!text.trim()}><Icon file="composer-ea52f.svg" /></button></div>
      </div>
      <input type="file" ref={file} className="sr-only" tabIndex={-1} accept="image/*" onChange={e=>{setAttachment(e.target.files?.[0]?.name||'');setStatus(e.target.files?.[0]?'Image selected locally.':'');}} />
    </form>
    {open&&<div id="aspect-ratio-menu" className="aspect-menu glass-panel" role="menu" aria-label="Aspect ratio options" onKeyDown={menuKeys}>
      <p>Aspect ratio</p>
      {ratios.map(value=><button role="menuitemradio" aria-checked={ratio===value} key={value} onClick={()=>{setRatio(value);setOpen(false);trigger.current?.focus();}}>{value!=='Auto'&&<span className="ratio-symbol"><span className={`ratio-icon ratio-${value.replace(':','-')}`} /></span>}<span>{value}</span>{value===ratio&&<Icon file="composer-15fe7.svg" />}</button>)}
    </div>}
    <span role="status" className="sr-only">{status}</span>
  </div></DemoCanvas>;
}
