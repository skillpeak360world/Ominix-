'use client';
import { useState, useEffect, useRef } from 'react';

const LANGS = ["English","Spanish","French","German","Chinese","Hindi","Arabic","Portuguese","Russian","Japanese","Igbo","Yoruba","Hausa","Swahili","Korean","Italian"];
const VOICES = ["Friendly","Calm","Professional","Energetic","Cinematic","Poetic"];
const PLUGINS = [
  {id:"web", name:"🌐 Web Search", desc:"Live search"},
  {id:"image", name:"🎨 Image Gen", desc:"Create images"},
  {id:"video", name:"🎬 Video Gen", desc:"Create videos"},
  {id:"code", name:"💻 Code", desc:"Write code"},
  {id:"jobs", name:"💼 Jobs", desc:"Find AI jobs"},
];

const BACKGROUNDS = {
  "Gold/Purple/Blue/Black": "from-[#FFD700] via-[#6A0DAD] via-[#0A1AFF] to-black",
  "Midnight": "from-black via-[#0f172a] to-[#1e1b4b]",
  "Gold Black": "from-[#FFD700] via-black to-black",
  "Purple": "from-purple-600 via-[#6A0DAD] to-black",
  "Ocean": "from-cyan-400 via-blue-600 to-black",
  "Sunset": "from-orange-400 via-pink-600 to-black",
  "Forest": "from-green-400 via-emerald-700 to-black",
  "Neon": "from-[#ff00ff] via-[#00ffff] to-black",
  "Royal": "from-yellow-400 via-purple-800 to-indigo-950",
};

export default function Home(){
  const [theme, setTheme] = useState("Gold/Purple/Blue/Black");
  const [activePlugins, setActivePlugins] = useState({web:true, image:true, video:true});
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("English");
  const [voice, setVoice] = useState("Friendly");
  const [menu, setMenu] = useState(false);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  // DIGITAL CINEMATIC SPARKS + GRID
  useEffect(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;
    const sparks = Array.from({length:120}, ()=>({
      x: Math.random()*c.width, y: Math.random()*c.height,
      r: Math.random()*2.8, dx:(Math.random()-0.5)*1.5, dy:(Math.random()-0.5)*1.5,
      color: Math.random()>0.5? "#FFD700" : Math.random()>0.5? "#8A2BE2" : "#00BFFF"
    }));
    let gridOffset=0;
    function draw(){
      ctx.clearRect(0,0,c.width,c.height);
      // digital grid
      ctx.strokeStyle="rgba(255,215,0,0.07)"; ctx.lineWidth=1;
      gridOffset+=0.5;
      for(let i=0;i<c.width;i+=40){ ctx.beginPath(); ctx.moveTo(i+gridOffset%40,0); ctx.lineTo(i+gridOffset%40,c.height); ctx.stroke(); }
      for(let i=0;i<c.height;i+=40){ ctx.beginPath(); ctx.moveTo(0,i+gridOffset%40); ctx.lineTo(c.width,i+gridOffset%40); ctx.stroke(); }
      // sparks
      sparks.forEach(s=>{
        s.x+=s.dx; s.y+=s.dy;
        if(s.x<0||s.x>c.width) s.dx*=-1;
        if(s.y<0||s.y>c.height) s.dy*=-1;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=s.color; ctx.shadowBlur=15; ctx.shadowColor=s.color; ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  },[]);

  const togglePlugin = (id)=> setActivePlugins(p=>({...p, [id]:!p[id]}));

  const handleSend = async()=>{
    if(!query.trim()) return;
    const userMsg = {role:"user", text:query, type:"text"};
    setHistory(h=>[...h, userMsg]);
    const q = query; setQuery(""); setLoading(true);

    try{
      // IMAGE generation
      if((q.toLowerCase().includes("image") || q.toLowerCase().includes("generate") || activePlugins.image) && (q.toLowerCase().includes("create") || q.toLowerCase().includes("draw") || activePlugins.image)){
        if(q.toLowerCase().includes("image") || q.toLowerCase().includes("picture") || q.toLowerCase().includes("draw") || activePlugins.image && q.length<100){
          const res = await fetch("/api/image", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({prompt:q})});
          const data = await res.json();
          if(data.imageUrl) { setHistory(h=>[...h, {role:"ominix", text:`Generated image for: "${q}"`, image:data.imageUrl}]); setLoading(false); return; }
        }
      }
      // VIDEO generation
      if(q.toLowerCase().includes("video") && activePlugins.video){
        const res = await fetch("/api/video", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({prompt:q})});
        const data = await res.json();
        if(data.videoUrl) { setHistory(h=>[...h, {role:"ominix", text:`Generated video frame for: "${q}"`, image:data.videoUrl, isVideo:true}]); setLoading(false); return; }
      }
      // Normal ASK
      const res = await fetch("/api/ask", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question:q, language:lang, tone:voice})});
      const data = await res.json();
      setHistory(h=>[...h, {role:"ominix", text:data.answer || "Ominix ready"}]);
    }catch(e){ setHistory(h=>[...h, {role:"ominix", text:"Error: "+e.message}]); }
    setLoading(false);
  };

  return(
    <div className={`min-h-screen bg-gradient-to-br ${BACKGROUNDS[theme]} relative overflow-hidden text-white`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.15),transparent_60%)] z-0"/>

      {/* MENU BAR */}
      <header className="relative z-10 flex justify-between items-center p-4 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 flex items-center justify-center font-black">O</div>
          <h1 className="text-2xl md:text-4xl font-black tracking-widest">OMINIX v4 <span className="text-xs bg-yellow-400 text-black px-2 rounded">CINEMATIC</span></h1>
        </div>
        <button onClick={()=>setMenu(!menu)} className="text-2xl bg-white/10 px-4 py-2 rounded-xl">☰ Menu</button>
      </header>

      {menu && (
        <div className="relative z-20 grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-black/90 text-sm">
          {["Home","/image","/video","/jobs","History","Plugins","Settings","About","Privacy","Terms","Contact","API Docs"].map(p=><div key={p} className="p-3 bg-white/10 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/20 cursor-pointer">{p}</div>)}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto p-4">
        {/* BACKGROUNDS */}
        <div className="mb-3">
          <p className="text-xs opacity-70 mb-1">🎨 Digital Cinematic Backgrounds:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(BACKGROUNDS).map(t=>(
              <button key={t} onClick={()=>setTheme(t)} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${theme===t?'bg-yellow-400 text-black border-yellow-400 scale-105':'bg-black/40 border-white/20'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* PLUGINS BAR */}
        <div className="bg-black/40 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-3 mb-4">
          <p className="text-xs opacity-70 mb-2">🔌 PLUGINS - Click to enable/disable:</p>
          <div className="flex flex-wrap gap-2">
            {PLUGINS.map(pl=>(
              <button key={pl.id} onClick={()=>togglePlugin(pl.id)} className={`px-3 py-2 rounded-xl text-xs border flex flex-col items-start ${activePlugins[pl.id]?'bg-yellow-400 text-black border-yellow-400':'bg-white/5 border-white/10 opacity-60'}`}>
                <span className="font-bold">{pl.name}</span><span className="text-[10px]">{pl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GREETING + CONTROLS */}
        <div className="bg-gradient-to-br from-black/60 to-purple-900/40 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-4 mb-4">
          <h2 className="text-xl font-bold">Hi, I am OMINIX ✨ Your Cinematic AI</h2>
          <p className="text-xs opacity-80 mt-1">Gold • Purple • Blue • Black digital world. I generate images, videos, speak {LANGS.length} languages.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-white text-black px-3 py-2 rounded-xl text-sm">{LANGS.map(l=><option key={l}>{l}</option>)}</select>
            <select value={voice} onChange={e=>setVoice(e.target.value)} className="bg-white text-black px-3 py-2 rounded-xl text-sm">{VOICES.map(v=><option key={v}>{v}</option>)}</select>
            <button onClick={()=>fileRef.current.click()} className="bg-white text-black px-4 py-2 rounded-xl font-bold">➕ Upload</button>
            <input ref={fileRef} type="file" hidden onChange={e=>alert("Uploaded: "+e.target.files[0].name)} />
            <button onClick={()=>{ const last=[...history].reverse().find(m=>m.role==="ominix"); if(last) navigator.clipboard.writeText(last.text); alert("Copied!"); }} className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-sm">🔗 Copy Link</button>
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-sm">🔐 Login</button>
          </div>
        </div>

        {/* CHAT HISTORY */}
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-3 min-h-[55vh] space-y-3 mb-4">
          {history.length===0 && <div className="opacity-50 text-sm text-center mt-10">Try: "Create image of golden galaxy" or "Create video of future city" or "Ask anything"</div>}
          {history.map((m,i)=>(
            <div key={i} className={`p-3 rounded-2xl max-w-[90%] ${m.role==="user"?"bg-white text-black ml-auto":"bg-gradient-to-br from-yellow-400 to-yellow-600 text-black mr-auto border border-yellow-300"}`}>
              <div className="font-bold text-xs mb-1">{m.role==="user"?"YOU":`OMINIX • ${lang} • ${voice}`}</div>
              <div>{m.text}</div>
              {m.image && <img src={m.image} alt="gen" className="mt-2 rounded-xl w-full max-w-md border-2 border-white/50"/>}
              {m.role==="ominix" && <div className="flex gap-2 mt-2"><button onClick={()=>navigator.clipboard.writeText(m.text)} className="text-[10px] bg-black/20 px-2 py-1 rounded">Copy</button><button className="text-[10px] bg-black/20 px-2 py-1 rounded">🔗 Share</button></div>}
            </div>
          ))}
          {loading && <div className="text-yellow-300 animate-pulse text-sm">✨ Ominix generating...</div>}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 sticky bottom-4 bg-black/80 backdrop-blur p-2 rounded-2xl border border-yellow-400/30">
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()} placeholder="Ask anything... try 'create image of...' or 'create video of...'" className="flex-1 bg-white text-black p-3 rounded-xl outline-none"/>
          <button onClick={handleSend} className="bg-yellow-400 text-black px-6 rounded-xl font-black hover:bg-yellow-300">Send</button>
        </div>
      </div>
    </div>
  );
          }
