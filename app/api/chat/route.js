export async function POST(req){
  try{
    const {messages, language="English", tone="Friendly"} = await req.json();
    const groqKey = process.env.GROQ_API_KEY;
    
    if(!groqKey){
      return Response.json({answer: "Add GROQ_API_KEY in Vercel Env for chat to work"});
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:"POST",
      headers:{"Content-Type":"application/json", "Authorization":`Bearer ${groqKey}`},
      body: JSON.stringify({
        model:"llama-3.1-8b-instant",
        messages:[
          {role:"system", content:`You are OMINIX v4, cinematic AI. Speak in ${language}, tone: ${tone}. Be helpful.`},
          ...(messages || [])
        ],
        max_tokens: 1000
      })
    });
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Ominix is here!";
    return Response.json({answer});
  }catch(e){
    return Response.json({error:e.message}, {status:500});
  }
}
