'use client'
import { useState, useEffect, useRef } from 'react'
const BGS=[
 {n:'Gold/Blue/Purple/Black Cinematic',s:'radial-gradient(circle at 20% 30%, #FFD700 0%, #1e3a8a 25%, #6d28d9 50%, #000 100%)'},
 {n:'Midnight Blue',s:'radial-gradient(circle,#0f172a,#1e3a8a,#000)'},
 {n:'Gold Black',s:'linear-gradient(135deg,#000,#FFD700,#000)'},
 {n:'Purple Haze',s:'linear-gradient(135deg,#6d28d9,#000,#ec4899)'},
 {n:'Ocean',s:'linear-gradient(135deg,#06b6d4,#1e3a8a,#000)'},
 {n:'Sunset',s:'linear-gradient(135deg,#f59e0b,#ef4444,#000)'},
 {n:'Forest',s:'linear-gradient(135deg,#10b981,#064e3b,#000)'},
 {n:'Neon City',s:'linear-gradient(135deg,#ff00ff,#00ffff,#000)'},
 {n:'Royal',s:'linear-gradient(135deg,#FFD700,#6d28d9,#000)'},
 {n:'Pure Black Sparks',s:'radial-gradient(circle,#222,#000)'},
]
export default function Home(){
 const [bg,setBg]=useState(0); const [jobs,setJobs]=useState([]); const [input,setInput]=useState(''); const [msgs,setMsgs]=useState([]); const [lang,setLang]=useState('en-US'); const fileRef=useRef(null)
 useEffect(()=>{ const h=localStorage.getItem('ominix_v4_history'); if(h) setMsgs(JSON.parse(h)); const b=localStorage.getItem('ominix_bg'); if(b) setBg(parseInt(b)); },[])
 useEffect(()=>{ localStorage.setItem('ominix_v4_history',JSON.stringify(msgs)) },[msgs])
 const speak=(t,l=lang)=>{ const u=new SpeechSynthesisUtterance(t); u.lang=l; const vs=speechSynthesis.getVoices(); u.voice=vs.find(v=>v.lang.includes(l))||vs[0]; speechSynthesis.speak(u) }
 const fetchJobs=async()=>{ const r=await fetch('/api/jobs'); const d=await r.json(); setJobs(d) }
 const send=async()=>{
  if(!input) return
  if(input.startsWith('/image ')){
   const p=input.replace('/image ',''); const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}); const d=await r.json(); setMsgs([...msgs,{q:input,a:`High quality image: ${p}`,img:d.url}]); setInput(''); return
  }
  if(input.startsWith('/video ')){
   const p=input.replace('/video ',''); const r=await fetch('/api/video',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}); const d=await r.json(); setMsgs([...msgs,{q:input,a:`High quality video frame for: ${p}`,img:d.url,video:true}]); setInput(''); return
  }
  const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:input})}); const d=await r.json()
  let final=d.reply
  if(lang!=='en-US'){ try{ const tr=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(final)}&langpair=en|${lang.slice(0,2)}`); const td=await tr.json(); final=td.responseData?.translatedText||final }catch{} }
  setMsgs([...msgs,{q:input,a:final,time:new Date().toISOString()}]); speak(final,lang); setInput('')
 }
 const upload=(e)=>{ const f=e.target.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ setMsgs([...msgs,{q:`Uploaded: ${f.name}`,a:`File ${f.name} uploaded and plugged 🔌`,file:rd.result,fileName:f.name}]) }; rd.readAsDataURL(f) }
 return(
  <main style={{minHeight:'100vh',background:BGS[bg].s,color:'white',padding:'20px',position:'relative'}}>
   <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(white 1px, transparent 1px)',backgroundSize:'40px 40px',opacity:0.12}}></div>
   <div style={{position:'relative',zIndex:2,maxWidth:'900px',margin:'0 auto'}}>
    <h1 style={{fontSize:'48px',fontWeight:900}}>OMINIX v4</h1>
    <div style={{display:'flex',gap:'6px',flexWrap:'wrap',margin:'10px 0'}}>{BGS.map((b,i)=><button key={i} onClick={()=>{setBg(i); localStorage.setItem('ominix_bg',i)}} style={{padding:'6px 10px',background:bg===i?'gold':'rgba(0,0,0,0.6)',color:bg===i?'black':'white',border:'1px solid gold',borderRadius:'6px',fontSize:'11px'}}>{b.n}</button>)}</div>
    <div style={{display:'flex',gap:'8px',flexWrap:'wrap',margin:'10px 0'}}>
     <select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:'8px',borderRadius:'6px',color:'black'}}><option value="en-US">English</option><option value="fr-FR">French</option><option value="es-ES">Spanish</option><option value="de-DE">German</option><option value="yo-NG">Yoruba</option><option value="ig-NG">Igbo</option><option value="ha-NG">Hausa</option></select>
     <button onClick={()=>fileRef.current.click()} style={{padding:'8px',background:'#6d28d9',borderRadius:'6px'}}>📎 Upload Image/File/Video 🔌</button>
     <input ref={fileRef} type="file" hidden accept="image/*,video/*,.pdf,.docx,.txt" onChange={upload} />
     <button onClick={fetchJobs} style={{padding:'8px',background:'gold',color:'black',borderRadius:'6px',fontWeight:'bold'}}>Fetch Jobs</button>
     <button onClick={()=>{localStorage.clear(); setMsgs([])}} style={{padding:'8px',background:'red',borderRadius:'6px'}}>Clear</button>
    </div>
    <p style={{fontSize:'11px',opacity:0.7}}>Use /image prompt | /video prompt | auto translate | 🔊 read aloud | saves history | grows with live web forever</p>
    <div style={{display:'flex',gap:'8px',marginTop:'12px'}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything, /image golden city, /video flying car..." style={{flex:1,padding:'12px',borderRadius:'8px',color:'black'}} /><button onClick={send} style={{padding:'12px 18px',background:'gold',color:'black',fontWeight:'bold',borderRadius:'8px'}}>Send</button></div>
    <div style={{marginTop:'20px'}}>{msgs.map((m,i)=><div key={i} style={{background:'rgba(0,0,0,0.6)',padding:'12px',margin:'10px 0',borderRadius:'10px',border:'1px solid rgba(255,215,0,0.3)'}}><div><b>You:</b> {m.q}</div><div style={{marginTop:'6px'}}><b>AI:</b> {m.a}</div>{m.img&&<img src={m.img} style={{width:'100%',maxWidth:'500px',marginTop:'10px',borderRadius:'10px',border:'2px solid gold'}} />}<div style={{marginTop:'8px',display:'flex',gap:'8px'}}><button onClick={()=>navigator.clipboard.writeText(m.a)} style={{fontSize:'12px',padding:'4px 8px',background:'rgba(255,255,255,0.2)',borderRadius:'4px'}}>📋 Copy</button><button onClick={()=>speak(m.a)} style={{fontSize:'12px',padding:'4px 8px',background:'rgba(255,215,0,0.3)',borderRadius:'4px'}}>🔊 {lang}</button></div></div>)}</div>
    <div style={{marginTop:'20px'}}>{jobs.map((j,i)=><div key={i} style={{background:'rgba(0,0,0,0.5)',padding:'10px',margin:'6px 0',borderRadius:'8px',border:'1px solid gold'}}>{j.title||j.url||JSON.stringify(j).slice(0,200)}</div>)}</div>
   </div>
  </main>
 )
     }
