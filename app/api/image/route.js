import { NextResponse } from 'next/server'
export async function POST(req){
  const {prompt} = await req.json()
  const clean = encodeURIComponent(prompt + ', ultra high quality, 8k, cinematic, highly detailed')
  const url = `https://image.pollinations.ai/prompt/${clean}?width=1920&height=1080&nologo=true&enhance=true`
  return NextResponse.json({url})
}
