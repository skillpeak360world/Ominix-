'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
const BGS=[
 {n:'Gold/Blue/Purple/Black',s:'radial-gradient(circle at 20% 30%, #FFD700 0%, #1e3a8a 25%, #6d28d9 50%, #000 100%)'},
 {n:'Midnight',s:'radial-gradient(circle,#0f172a,#1e3a8a,#000)'},
 {n:'Gold Black',s:'linear-gradient(135deg,#000,#FFD700,#000)'},
 {n:'Purple',s:'linear-gradient(135deg,#6d28d9,#000,#ec4899)'},
 {n:'Ocean',s:'linear-gradient(135deg,#06b6d4,#1e3a8a,#000)'},
 {n:'Sunset',s:'linear-gradient(135deg,#f59e0b,#ef4444,#000)'},
 {n:'Forest',s:'linear-gradient(135deg,#10b981,#064e3b,#000)'},
 {n:'Neon',s:'linear-gradient(135deg,#ff00ff,#00ffff,#000)'},
 {n:'Royal',s:'linear-gradient(135deg,#FFD700,#6d28d9,#000)'},
 {n:'Black Sparks',s:'radial-gradient(circle,#222,#000)'},
]
export default function Home(){
 const [bg,setBg]=useState(0); const [jobs,setJobs]=useState([]); const [input,setInput]=useState(''); const [msgs,setMsgs]=useState([]); const [lang,setLang]=useState('en-US'); const fileRef=useRef(null)
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [user,setUser]=useState(null); const [showLogin,setShowLogin]=useState(false)
 useEffect(()=>{ const b=localStorage.getItem('ominix_bg'); if(b) setBg(parseInt(b)); supabase.auth.getUser().then(({data})=>{ if(data.user){ setUser(data.user); loadHistory(data.user.id) } }) },[])
 const loadHistory=async(uid)=>{ const {data}=await supabase.from('history').select('*').eq('user_id',uid).order('created_at',{ascending:true}).limit(100); if(data) setMsgs(data.map(d=>({q:d.q,a:d.a,img:d.img}))) }
 const saveHistory=async(q,a,img)=>{ if(!user) return; await supabase.from('history').insert({user_id:user.id,q,a,img:img||null}) }
 const speak=(t,l=lang)=>{ const u=new SpeechSynthesisUtterance(t); u.lang=l; const vs=speechSynthesis.getVoices(); u.voice=vs.find(v=>v.lang.includes(l))||vs[0]; speechSynthesis.speak(u) }
 const send=async()=>{
  if(!input) return
  if(input.startsWith('/image ')){ const p=input.replace('/image ',''); const r=await fetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}); const d=await r.json(); setMsgs(m=>[...m,{q:input,a:p,img:d.url}]); saveHistory(input,p,d.url); setInput(''); return }
  if(input.startsWith('/video ')){ const p=input.replace('/video ',''); const r=await fetch('/api/video',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})}); const d=await r.json(); setMsgs(m=>[...m,{q:input,a:p,img:d.url}]); saveHistory(input,p,d.url); setInput(''); return }
  const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:input})}); const d=await r.json(); let final=d.reply
  if(lang!=='en-US'){ try{ const tr=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(final)}&langpair=en|${lang.slice(0,2)}`); const td=await tr.json(); final=td.responseData?.translatedText||final }catch{} }
  setMsgs(m=>[...m,{q:input,a:final}]); saveHistory(input,final); speak(final,lang); setInput('')
 }
 const upload=(e)=>{ const f=e.target.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ setMsgs(m=>[...m,{q:`Uploaded: ${f.name}`,a:`File plugged 🔌`,file:rd.result}]); saveHistory(`Uploaded ${f.name}`,`File plugged`); }; rd.readAsDataURL(f) }
 return(
  <main style={{minHeight:'100vh',background:BGS[bg].s,color:'white',padding:'20px',position:'relative'}}><div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(white 1px, transparent 1px)',backgroundSize:'40px 40px',opacity:0.12}}></div><div style={{position:'relative',zIndex:2,maxWidth:'900px',margin:'0 auto'}}>
   <h1 style={{fontSize:'48px',fontWeight:900}}>OMINIX v4</h1>
   <div style={{display:'flex',gap:'6px',flexWrap:'wrap',margin:'10px 0'}}>{BGS.map((b,i)=><button key={i} onClick={()=>{setBg(i); localStorage.setItem('ominix_bg',i)}} style={{padding:'6px 10px',background:bg===i?'gold':'rgba(0,0,0,0.6)',color:bg===i?'black':'white',border:'1px solid gold',borderRadius:'6px',fontSize:'11px'}}>{b.n}</button>)}</div>
   <div style={{display:'flex',gap:'8px',flexWrap:'wrap',margin:'10px 0'}}>
    <select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:'8px',borderRadius:'6px',color:'black'}}><option value="en-US">English</option><option value="fr-FR">French</option><option value="es-ES">Spanish</option><option value="yo-NG">Yoruba</option><option value="ig-NG">Igbo</option><option value="ha-NG">Hausa</option></select>
    <button onClick={()=>fileRef.current.click()} style={{padding:'8px',background:'#6d28d9',borderRadius:'6px'}}>📎 Upload 🔌</button><input ref={fileRef} type="file" hidden onChange={upload} />
    <button onClick={async()=>{const r=await fetch('/api/jobs'); const d=await r.json(); setJobs(d)}} style={{padding:'8px',background:'gold',color:'black',borderRadius:'6px',fontWeight:'bold'}}>Jobs</button>
    <button onClick={()=>setShowLogin(!showLogin)} style={{padding:'8px',background:'white',color:'black',borderRadius:'6px',fontWeight:'bold'}}>{user?user.email:'🔐 Login'}</button>
   </div>
   {showLogin && (<div style={{background:'rgba(0,0,0,0.8)',padding:'15px',borderRadius:'10px',margin:'10px 0',border:'2px solid gold'}}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{padding:'10px',width:'45%',marginRight:'5%',borderRadius:'6px',color:'black'}} /><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{padding:'10px',width:'45%',borderRadius:'6px',color:'black'}} /><div style={{display:'flex',gap:'8px',marginTop:'10px'}}><button onClick={async()=>{ const r=await fetch('/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); const d=await r.json(); if(d.user||d.id){ alert('Signed up! Now login'); } else alert(d.error||'Check email') }} style={{padding:'8px',background:'gold',color:'black',borderRadius:'6px',flex:1}}>Signup</button><button onClick={async()=>{ const {data,error}=await supabase.auth.signInWithPassword({email,password}); if(error) alert(error.message); else { setUser(data.user); loadHistory(data.user.id); setShowLogin(false); alert('Logged in') } }} style={{padding:'8px',background:'white',color:'black',borderRadius:'6px',flex:1}}>Login</button><button onClick={async()=>{ await supabase.auth.signOut(); setUser(null); setMsgs([]) }} style={{padding:'8px',background:'red',borderRadius:'6px'}}>Logout</button></div></div>)}
   <p style={{fontSize:'11px',opacity:0.7}}>Per-person history saved when logged in | /image | /video | 🔊 | 🔌</p>
   <div style={{display:'flex',gap:'8px',marginTop:'12px'}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything..." style={{flex:1,padding:'12px',borderRadius:'8px',color:'black'}} /><button onClick={send} style={{padding:'12px 18px',background:'gold',color:'black',fontWeight:'bold',borderRadius:'8px'}}>Send</button></div>
   <div style={{marginTop:'20px'}}>{msgs.map((m,i)=><div key={i} style={{background:'rgba(0,0,0,0.6)',padding:'12px',margin:'10px 0',borderRadius:'10px',border:'1px solid rgba(255,215,0,0.3)'}}><div><b>You:</b> {m.q}</div><div style={{marginTop:'6px'}}><b>AI:</b> {m.a}</div>{m.img&&<img src={m.img} style={{width:'100%',maxWidth:'500px',marginTop:'10px',borderRadius:'10px',border:'2px solid gold'}} />}<div style={{marginTop:'8px',display:'flex',gap:'8px'}}><button onClick={()=>navigator.clipboard.writeText(m.a)} style={{fontSize:'12px',padding:'4px 8px',background:'rgba(255,255,255,0.2)',borderRadius:'4px'}}>📋 Copy</button><button onClick={()=>speak(m.a)} style={{fontSize:'12px',padding:'4px 8px',background:'rgba(255,215,0,0.3)',borderRadius:'4px'}}>🔊</button></div></div>)}</div>
  </div></main>
 )
}
