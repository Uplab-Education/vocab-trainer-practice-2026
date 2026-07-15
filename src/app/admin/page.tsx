import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/auth/session";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    return (
      <>
      <PageHeader
        eyebrow="Admin"
        title="Admin access required"
          description="Log in with an administrator account to manage vocabulary content."
        />
        <EmptyState
          title="You do not have access to this area"
          description="This section is reserved for users with admin permissions."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Content management"
        description="Manage vocabulary sets, words, and imports from one workspace."
      />
      <EmptyState
        title="Content management is coming next"
        description="This area will include word set tables, edit forms, and CSV import tools."
      />
    </>
  );
}
