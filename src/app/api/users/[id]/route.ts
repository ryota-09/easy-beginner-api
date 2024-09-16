import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, task: data })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

  return await NextResponse.json({ status: 200, task: data })
}