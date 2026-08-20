import { PageHeader } from "@/components/ui/page-header";
import { WordSetForm } from "@/components/WordSetForm";
import { EmptyState } from "@/components/ui/empty-state";
import { getWordSetById } from "@/features/word-sets/repository";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    setId: string;
  }>;
};

export default async function EditWordSetPage({ params }: PageProps) {
  const resolvedParams = await params;
  const wordSet = await getWordSetById(resolvedParams.setId);

  if (!wordSet) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <EmptyState
          title="Set not found"
          description="The vocabulary set you want to edit does not exist in the database."
        />
        <div className="mt-6 flex justify-center">
          <Link href="/admin" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const firstWord = wordSet.words && wordSet.words.length > 0 ? wordSet.words[0] : null;
  
  /*Form the initial data for the form, including title, description, category, difficulty, and words*/
  const initialData = {
    title: wordSet.title,
    description: wordSet.description || "",
    category: firstWord?.category || "",
    difficulty: (firstWord?.difficulty || "") as "easy" | "medium" | "hard" | "",
    words: wordSet.words && wordSet.words.length > 0 
      ? wordSet.words.map(w => ({
          englishWord: w.englishWord,
          ukrainianTranslation: w.ukrainianTranslation,
          exampleSentence: w.exampleSentence || ""
        }))
      : [] 
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
        <WordSetForm initialData={initialData} isEditMode={true} wordSetId={wordSet.id} />
      </div>
    </div>
  );
}