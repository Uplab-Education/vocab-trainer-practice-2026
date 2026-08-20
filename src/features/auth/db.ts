import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/users";

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const [user] = await db.insert(users).values({
    name,
    email,
    passwordHash,
  }).returning();
  
  return user;
}