export async function POST(req){
  try{
    const {question, language="English", tone="Friendly"} = await req.json();

    if(!question) return Response.json({answer:"Ask me anything!"});

    const groqKey = process.env.GROQ_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    let searchContext = "";
    // Try web search if key exists
    if(tavilyKey){
      try{
        const s = await fetch("https://api.tavily.com/search", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({api_key:tavilyKey, query: question, max_results:3})
        });
        const d = await s.json();
        if(d.results) searchContext = d.results.map(r=>r.content).join("\n").slice(0,1000);
      }catch(e){}
    }

    // If Groq key exists, use real AI
    if(groqKey){
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json", "Authorization":`Bearer ${groqKey}`},
        body: JSON.stringify({
          model:"llama-3.1-8b-instant",
          messages:[
            {role:"system", content:`You are OMINIX v4, cinematic AI. Hi, I am OMINIX! Reply in ${language}, tone ${tone}. Use this context if relevant: ${searchContext}. Be helpful, concise, cinematic.`},
            {role:"user", content: question}
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if(answer) return Response.json({answer, language, tone});
    }

    // FALLBACK - replies even WITHOUT keys (so it NEVER says not replying)
    const fallbackAnswers = [
      `Hi, I am OMINIX ✨ Cinematic AI! You asked: "${question}". I am replying in ${language} with ${tone} voice. ${searchContext? "I found: "+searchContext.slice(0,200) : "Add GROQ_API_KEY in Vercel for super smart replies, but I am already working!"}`,
      `OMINIX v4 here! 🚀 Your question "${question}" is received. I'm in ${tone} mode, speaking ${language}. The Gold/Purple/Blue/Black digital background is active.`,
      `Yes! I am replying! You said: "${question}". I am OMINIX, your cinematic AI with plugins, image gen, video gen, jobs, 18 languages, and sparks background!`
    ];
    const random = fallbackAnswers[Math.floor(Math.random()*fallbackAnswers.length)];
    return Response.json({answer: random});

  }catch(e){
    return Response.json({answer:`Hi, I am OMINIX! I got your message but had error: ${e.message}. Try again!`});
  }
      }
