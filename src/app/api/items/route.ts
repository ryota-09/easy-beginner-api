import { corsHeaders } from "@/lib";
import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    return NextResponse.json({ status: 500, message: "エラーが発生しました。" })
  }

  return await NextResponse.json({ status: 200, data: data }, {
    status: 200,
    headers: corsHeaders
  })
}