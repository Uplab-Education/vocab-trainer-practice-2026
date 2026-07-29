import { PageHeader } from "@/components/ui/page-header";
import { WordSetForm } from "@/components/WordSetForm";
import Link from "next/link";

export default function CreateWordSetPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/admin" className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to Admin Dashboard
      </Link>
      
      <PageHeader
        eyebrow="Admin"
        title="Create New Word Set"
        description="Add a new vocabulary set to the platform."
      />
      
      <div className="mt-8">
        <WordSetForm />
      </div>
    </div>
  );
}