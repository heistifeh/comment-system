import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("comments").select("*");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase.from("comments").insert(body).select();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const { commentId, payload } = await request.json();

  if (!commentId) {
    return NextResponse.json(
      { message: "commentId is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .update({ payload })
    .eq("id", commentId)
    .select();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const commentId = request.nextUrl.searchParams.get("comment_id");

  if (!commentId) {
    return NextResponse.json(
      { message: "comment_id query parameter is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .select();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
