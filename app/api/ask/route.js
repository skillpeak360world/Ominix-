import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { question } = await req.json()

    // Search web with Tavily
    let context = ""
    try {
      const tRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: question,
          max_results: 3,
          include_answer: true
        })
      })
      const tData = await tRes.json()
      context = tData.results?.map(r=>r.content).join("\n").slice(0,3000) || ""
    } catch(e){ console.log("Tavily error") }

    // Ask Groq
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: `You are Ominix, cinematic AI. Be helpful, beautiful, concise. Use this context: ${context}` },
          { role: "user", content: question }
        ],
        temperature: 0.7
      })
    })

    const data = await groqRes.json()

    if(data.error){
      return NextResponse.json({ answer: "Groq Error: " + data.error.message })
    }

    const answer = data.choices?.[0]?.message?.content || "No answer from AI"

    return NextResponse.json({ answer })

  } catch(err){
    return NextResponse.json({ answer: "Server error: " + err.message }, { status: 500 })
  }
            }
