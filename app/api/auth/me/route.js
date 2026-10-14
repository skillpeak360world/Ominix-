import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase.js'
export async function GET(){ const {data}=await supabase.auth.getUser(); return NextResponse.json(data) }
