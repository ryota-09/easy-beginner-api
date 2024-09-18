import { corsHeaders } from "@/lib";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, data: data }, {
    status: 200,
    headers: corsHeaders
  })
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('X-API-KEY');
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ status: 401, message: "APIキーが無効です。" }, {
      status: 500,
      headers: corsHeaders
    })
  }

  const body = await req.json();
  const { userName, email, password } = body;

  const { data, error } = await supabase.from('users').insert({
    userName: userName,
    email: email,
    password: password
  }).select()

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" }, {
      status: 500,
      headers: corsHeaders
    })
  }
  
  return await NextResponse.json({ status: 200, data: data }, {
    status: 200,
    headers: corsHeaders
  })
}

/**
 * fetch のプリフライトリクエストに対応するための OPTIONS メソッド
 * @returns 
 */
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: corsHeaders
  })
}