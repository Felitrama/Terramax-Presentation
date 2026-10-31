import React, {useState,useEffect,useRef,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import Slide from './Slides';
import {slides} from './content';
import notes from './notes.json';
import './styles.css';

const presenter=new URLSearchParams(location.search).has('presenter');
const clamp=n=>Math.max(0,Math.min(slides.length-1,n));
const fromHash=()=>clamp((parseInt(location.hash.slice(1),10)||1)-1);
function Icon({name}){const paths={previous:'m14 6-6 6 6 6',next:'m10 6 6 6-6 6',fullscreen:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',notes:'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5'};return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>}
function App(){
 const [index,setIndex]=useState(fromHash);const [scale,setScale]=useState(1);const [full,setFull]=useState(false);const [message,setMessage]=useState('');
 const frame=useRef(null),channel=useRef(null),current=useRef(index);current.current=index;
 const go=useCallback(n=>setIndex(clamp(n)),[]);
 const navigate=useCallback(delta=>{if(presenter)channel.current?.postMessage({type:'navigate',delta});else setIndex(n=>clamp(n+delta))},[]);
 useEffect(()=>{const resize=()=>{if(frame.current)setScale(Math.min(frame.current.clientWidth/1600,frame.current.clientHeight/900))};const observer=new ResizeObserver(resize);observer.observe(frame.current);resize();return()=>observer.disconnect()},[]);
 useEffect(()=>{const handler=()=>go(fromHash());window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler)},[go]);
 useEffect(()=>{history.replaceState(null,'',`${location.pathname}${location.search}#${index+1}`);document.title=`${presenter?'Notas · ':''}TerraMax · ${index+1}/${slides.length}`;if(!presenter)channel.current?.postMessage({type:'slide',index})},[index]);
 useEffect(()=>{const c=new BroadcastChannel('terramax-grupo7-presentation');channel.current=c;c.onmessage=({data})=>{if(presenter&&data.type==='slide')go(data.index);if(!presenter&&data.type==='navigate')setIndex(n=>clamp(n+data.delta));if(!presenter&&data.type==='request')c.postMessage({type:'slide',index:current.current})};if(presenter)c.postMessage({type:'request'});return()=>c.close()},[go]);
 const fullscreen=useCallback(async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{setMessage('No se pudo activar pantalla completa. Usá F11 en el navegador.')}},[]);
 const openNotes=useCallback(()=>{const url=new URL(location.href);url.searchParams.set('presenter','1');const win=window.open(url,'terramax-presenter','popup,width=1100,height=800');if(!win)setMessage('El navegador bloqueó la ventana de notas. Permití ventanas emergentes para este sitio.')},[]);
 useEffect(()=>{const sync=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync)},[]);
 useEffect(()=>{const key=e=>{if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.code==='Space'&&e.target.closest('button'))return;if(e.key==='ArrowRight'||e.code==='Space'){e.preventDefault();navigate(1)}else if(e.key==='ArrowLeft'){e.preventDefault();navigate(-1)}else if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen()}else if(e.key.toLowerCase()==='p'&&!presenter){e.preventDefault();openNotes()}else if(e.key==='Escape'&&document.fullscreenElement)document.exitFullscreen().catch(()=>{})};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[navigate,fullscreen,openNotes]);
 useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),6500);return()=>clearTimeout(t)},[message]);
 const slide=slides[index];
 return <main className={presenter?'app presenter-app':'app'}>
  <div className="viewport" ref={frame}><div className="deck-shell" style={{width:1600*scale,height:900*scale}}><div className="deck" style={{transform:`scale(${scale})`}}><div className="slide-enter" key={index}><Slide slide={slide} index={index}/></div>
   <nav className="controls" aria-label="Controles de presentación"><button onClick={()=>navigate(-1)} disabled={index===0} aria-label="Diapositiva anterior" title="Anterior (←)"><Icon name="previous"/></button><span className="slide-count" aria-live="polite" aria-atomic="true">{index+1}<span>/</span>{slides.length}</span><button onClick={()=>navigate(1)} disabled={index===slides.length-1} aria-label="Diapositiva siguiente" title="Siguiente (→ o espacio)"><Icon name="next"/></button><span className="control-divider"/>{!presenter&&<button onClick={openNotes} aria-label="Abrir notas del presentador" title="Notas del presentador (P)"><Icon name="notes"/></button>}<button onClick={fullscreen} aria-label={full?'Salir de pantalla completa':'Activar pantalla completa'} title="Pantalla completa (F)" aria-pressed={full}><Icon name="fullscreen"/></button></nav>
   <div className="progress" role="progressbar" aria-label="Avance de la presentación" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={index+1}><span style={{width:`${(index+1)/slides.length*100}%`}}/></div>
  </div></div></div>
  {presenter&&<aside className="presenter-notes"><div className="notes-top"><span className="label">Vista del presentador</span><span>Duración total · 6:00</span></div><h2>{slide.section}</h2><div className="speaker-time">{slide.speaker}<span>{slide.seconds} segundos</span><span>{notes[index].range}</span></div><p className="spoken-note">{notes[index].text}</p><p className="next-slide">{index<slides.length-1?`A continuación: ${slides[index+1].section} · ${slides[index+1].speaker}`:'Fin de la presentación.'}</p><p className="notes-help">Mové esta ventana a tu pantalla personal y proyectá la ventana principal. Las flechas controlan la presentación. Las notas nunca se superponen a la vista proyectada.</p></aside>}
  {message&&<div role="status" className="toast">{message}</div>}
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
