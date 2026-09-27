import { useRef, useState } from 'react';
import { DemoCanvas, Icon, menuKeys, useDismiss } from './shared';
const agents = [
  {name:'Architect',description:'Structural design and system logic',color:'#bf337a'},
  {name:'Strategist',description:'High-level planning and roadmaps',color:'#f97513'},
  {name:'Researcher',description:'Deep-dive analysis and data synthesis',color:'#412daa'},
  {name:'Executor',description:'Rapid coding and task automation',color:'#2697d1'},
];
export function AgentSelectorDemo(){
  const [open,setOpen]=useState(true),[selected,setSelected]=useState<number|null>(null),[prompt,setPrompt]=useState(''),[voice,setVoice]=useState(false),[status,setStatus]=useState('');
  const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null),file=useRef<HTMLInputElement>(null);
  useDismiss(root,()=>setOpen(false));
  return <DemoCanvas label="Static agent selector"><div className="agent-demo" ref={root} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}}}>
    {open&&<div className="agent-menu" role="listbox" aria-label="Choose agent type" onKeyDown={menuKeys}>
      <p>Choose agent type</p>
      {agents.map((agent,i)=><button className={i === 1 ? 'reference-hover' : undefined} role="option" aria-selected={selected===i} key={agent.name} onClick={()=>{setSelected(i);setOpen(false);trigger.current?.focus();}}><Icon file={`agent-orb-${i}.svg`} /><strong style={{color:agent.color}}>{agent.name}</strong><span>{agent.description}</span></button>)}
    </div>}
    <form className="agent-composer" onSubmit={e=>{e.preventDefault();if(selected===null){setOpen(true);return;}setStatus(`${agents[selected].name} selected${prompt.trim()?`: ${prompt.trim()}`:''}. This is a local interface demo.`);setOpen(false);}}>
      <div className="agent-prompt-row">
        <button className="agent-chip" type="button" ref={trigger} aria-label="Choose agent type" aria-expanded={open} aria-haspopup="listbox" onClick={()=>setOpen(!open)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>('[role=option]')?.focus());}}}>{selected===null?'/agent':`/${agents[selected].name.toLowerCase()}`}</button>
        <input aria-label="Agent prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} />
        <div className="agent-send-controls"><button className="microphone-button" type="button" aria-label="Toggle voice input demo" aria-pressed={voice} onClick={()=>{setVoice(!voice);setStatus(voice?'Voice input demo stopped.':'Voice input demo enabled. No microphone is recorded.');}}><Icon file="agent-input-f233c.svg" /></button><button className="send-button dark-button" aria-label="Prepare agent request"><Icon file="agent-input-ea52f.svg" /></button></div>
      </div>
      <div className="agent-toolbar"><button type="button" aria-label="Attach a file to agent" onClick={()=>file.current?.click()}><Icon file="agent-input-f0ef0.svg" /></button><span className="agent-model"><Icon file="agent-input-ebaa0.svg" /><Icon file="agent-input-82b1d.svg" size={20}/><span>Sol 5.6 <span className="muted">High</span></span></span></div>
      <input className="sr-only" type="file" ref={file} tabIndex={-1} onChange={e=>setStatus(e.target.files?.[0]?`File selected locally: ${e.target.files[0].name}`:'')} />
    </form>
    <span role="status" className="sr-only">{status}</span>
  </div></DemoCanvas>;
}
