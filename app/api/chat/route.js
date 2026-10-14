import { NextResponse } from 'next/server'
export async function POST(req){
  const {message} = await req.json()
  const groq = process.env.GROQ_API_KEY
  const tavily = process.env.TAVILY_API_KEY
  let live = ""
  try{
    const s = await fetch('https://api.tavily.com/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:tavily,query:message,max_results:5,search_depth:'advanced',include_answer:true})})
    const sd = await s.json()
    live = sd.results?.map(x=>`${x.title}: ${x.content}`).join('\n') || ""
  }catch{}
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${groq}`},body:JSON.stringify({model:'llama3-70b-8192',messages:[{role:'system',content:`You are OMINIX v4. You grow unlimitedly. TODAY is ${new Date().toISOString()}. Use LIVE DATA to answer. If live data has new facts (like Ronaldo married in future), you KNOW it. Never say cutoff. LIVE DATA:\n${live}`},{role:'user',content:message}],temperature:0.7})})
  const d = await r.json()
  return NextResponse.json({reply:d.choices?.[0]?.message?.content || 'Error', live:!!live, time: new Date().toISOString()})
  }
