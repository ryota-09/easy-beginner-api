import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from('tasks').select('*');

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, data: data })
}

export async function POST(req: NextRequest) {
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

  return await NextResponse.json({ status: 200, data: data })
}