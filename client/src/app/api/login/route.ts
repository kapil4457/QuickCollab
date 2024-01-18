import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;
    const info = {
      email,

      password,
    };
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/sign-in`;
    const data = await axios.post(url, info, {
      withCredentials: true,
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(data);

    // cookies().set("sssstoken", data?.token, {
    //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // });
    return NextResponse.json(data.data);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err });
  }
}
