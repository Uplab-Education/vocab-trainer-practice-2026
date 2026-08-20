import { NextResponse } from "next/server";
import { setSessionCookie } from "@/auth/session";
import { getUserByEmail } from "@/features/auth/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.parse(body);

    /*Searching for the user in the database*/
    const user = await getUserByEmail(parsed.email);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    /*Validating the provided password against the stored hashed password*/
    const isPasswordValid = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    /*Creating a session cookie for the authenticated user*/
    await setSessionCookie(user);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    
    return NextResponse.json(
      { message: "Invalid input data." },
      { status: 400 },
    );
  }
}