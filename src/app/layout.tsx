import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/auth/auth-provider";
import { getCurrentUser } from "@/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vocabulary Trainer",
  description: "Learn English vocabulary through focused daily practice",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <AuthProvider initialUser={user}>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
