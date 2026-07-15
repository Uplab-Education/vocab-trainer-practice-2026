import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export default function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Login"
        description="Log in to continue learning, review progress, and manage vocabulary sets if your account has admin access."
      >
        <Button asChild href="/register" variant="secondary">
          Create account
        </Button>
      </PageHeader>
      <AuthForm mode="login" />
    </>
  );
}
