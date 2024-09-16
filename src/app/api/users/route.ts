import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, users: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userName, email, password } = body;
  
  const { data, error } = await supabase.from('users').insert({
    userName: userName,
    email: email,
    password: password
  }).select()

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, user: data })
}