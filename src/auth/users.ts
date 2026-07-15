export type UserRole = "user" | "admin";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type SeedUser = AppUser & {
  password: string;
};

const seedUsers: SeedUser[] = [
  {
    id: "student-seed",
    name: "Student User",
    email: "student@example.com",
    password: "password",
    role: "user",
  },
  {
    id: "admin-seed",
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    role: "admin",
  },
];

export function sanitizeUser(user: SeedUser | AppUser): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function findUserByCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = seedUsers.find((seedUser) => seedUser.email === normalizedEmail);

  if (!user || user.password !== password) {
    return null;
  }

  return sanitizeUser(user);
}

export function createRegisteredUser(name: string, email: string): AppUser {
  return {
    id: `registered-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: "user",
  };
}
