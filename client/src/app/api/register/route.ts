import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, name, password, avatar, role } = body;
    const info = {
      email,
      name,
      password,
      avatar,
      role,
    };
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/sign-up`;
    const { data } = await axios.post(url, info, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    cookies().set("token", data.token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(err.response.data);
  }
}
