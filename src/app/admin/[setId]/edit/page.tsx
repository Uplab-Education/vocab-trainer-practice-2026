import { PageHeader } from "@/components/ui/page-header";
import { WordSetForm } from "@/components/WordSetForm";
import Link from "next/link";

export default function EditWordSetPage() {
  /*Local initial data(for demonstration purposes)*/
  const mockInitialData = {
    title: "Basic Greetings",
    description: "Essential words for daily communication.",
    category: "Greetings",
    difficulty: "easy" as const,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/admin" className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to Admin Dashboard
      </Link>
      
      <PageHeader
        eyebrow="Admin"
        title="Edit Word Set"
        description="Update the details of an existing vocabulary set."
      />
      
      <div className="mt-8">
        <WordSetForm initialData={mockInitialData} isEditMode={true} />
      </div>
    </div>
  );
}