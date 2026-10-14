import { NextResponse } from 'next/server'
export async function POST(req){
  const {prompt} = await req.json()
  // High quality video via Pollinations + ready for Pika/Runway plug
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' cinematic video frame, 8k')}`
  // For real video, add PIKA_API_KEY or RUNWAY_API_KEY later
  return NextResponse.json({url:imageUrl, prompt, note:'Video frame generated in high quality. Plug Pika/Runway API key for true mp4.'})
}
