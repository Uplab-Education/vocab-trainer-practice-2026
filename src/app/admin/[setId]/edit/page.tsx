import { PageHeader } from "@/components/ui/page-header";
import { WordSetForm } from "@/components/WordSetForm";
import { EmptyState } from "@/components/ui/empty-state";
import { starterWordSets } from "@/features/word-sets/data";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    setId: string;
  }>;
};

export default async function EditWordSetPage({ params }: PageProps) {
  const resolvedParams = await params;
  /*Find the corresponding word set*/
  const wordSet = starterWordSets.find((set) => set.id === resolvedParams.setId);

  /*Handle unknown setId(Not Found State)*/
  if (!wordSet) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <EmptyState
          title="Set not found"
          description="The vocabulary set you want to edit does not exist."
        />
        <div className="mt-6 flex justify-center">
          <Link href="/admin" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /*Extract category and difficulty from the first word to populate the form*/
  const firstWord = wordSet.words[0];
  const initialData = {
    title: wordSet.title,
    description: wordSet.description,
    category: firstWord ? firstWord.category : "",
    difficulty: (firstWord ? firstWord.difficulty : "") as "easy" | "medium" | "hard" | "",
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
        <WordSetForm initialData={initialData} isEditMode={true} />
      </div>
    </div>
  );
}