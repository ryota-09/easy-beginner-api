import { corsHeaders } from "@/lib";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from('tasks').select('*');

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
    return NextResponse.json({ status: 401, message: "APIキーが無効です。" })
  }

  const body = await req.json();
  const { userId, title, description, completed, dueDate, priority } = body;

  const { data, error } = await supabase.from('tasks').insert({
    userId,
    title,
    description,
    completed,
    dueDate,
    priority
  }).select()

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
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