import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    cookies().delete("token");
    const data = {
      success: true,
      message: "Logged out successfully.",
    };
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(err.response.data);
  }
}
