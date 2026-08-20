import { NextResponse } from "next/server";
import { setSessionCookie } from "@/auth/session";
import { createUser, getUserByEmail } from "@/features/auth/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation with Zod
const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.parse(body);

    /*Checking if a user with the provided email already exists in the database*/
    const existingUser = await getUserByEmail(parsed.email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 },
      );
    }

    /*Hashing the password before storing it in the database*/
    const passwordHash = await bcrypt.hash(parsed.password, 10);

    /*Storing the new user in the database*/
    const user = await createUser(parsed.name, parsed.email, passwordHash);

    /*Creating a session cookie for the newly registered user*/
    await setSessionCookie(user);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 },
      );
    }
    console.error("Registration error:", error);
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}