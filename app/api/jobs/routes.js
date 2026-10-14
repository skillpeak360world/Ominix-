import { NextResponse } from 'next/server'
export async function GET(){
  const key = process.env.TAVILY_API_KEY
  try{
    const r = await fetch('https://api.tavily.com/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:key,query:'remote AI jobs hiring worldwide 2026',max_results:12,search_depth:'advanced'})})
    const d = await r.json()
    return NextResponse.json(d.results || [{title:'Add TAVILY_API_KEY in Vercel'}])
  }catch{ return NextResponse.json([{title:'Error fetching jobs'}]) }
}
