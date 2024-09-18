import { corsHeaders } from "@/lib";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, task: data }, {
    status: 200,
    headers: corsHeaders
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = req.headers.get('X-API-KEY');
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ status: 401, message: "APIキーが無効です。" })
  }

  const id = params.id;
  const body = await req.json();
  const { userName, email, password } = body;

  const { data, error } = await supabase.from('users').update({
    userName: userName,
    email: email,
    password: password
  }).eq('id', id);

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, task: data }, {
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