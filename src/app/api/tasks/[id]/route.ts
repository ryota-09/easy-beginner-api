import { corsHeaders } from "@/lib";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, data: data }, {
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
  const { userId, title, description, completed, dueDate, priority } = body;

  const { data, error } = await supabase.from('tasks').update({
    userId,
    title,
    description,
    completed,
    dueDate,
    priority,
  }).eq('id', id);

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, data: data }, {
    headers: corsHeaders
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = req.headers.get('X-API-KEY');
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ status: 401, message: "APIキーが無効です。" })
  }

  const id = params.id;
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, message: "削除が完了しました！" }, {
    headers: corsHeaders
  })
}