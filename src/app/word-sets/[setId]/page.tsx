import Link from "next/link";
import { starterWordSets } from "@/features/word-sets/data";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

type PageProps = {
  params: {
    setId: string;
  };
};

export default function WordSetDetailsPage({ params }: PageProps) {
  /* Searching for a set of words by ID */
  const wordSet = starterWordSets.find((set) => set.id === params.setId);

  /* Handling unknown setId (Not Found State) */
  if (!wordSet) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <EmptyState
          title="Set not found"
          description="The vocabulary set you are looking for does not exist."
        />
        <div className="mt-6 flex justify-center">
          <Link href="/word-sets" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to all sets
          </Link>
        </div>
      </div>
    );
  }

  /* Collect unique categories and difficulties for display in the header */
  const categories = Array.from(new Set(wordSet.words.map((w) => w.category))).join(', ');
  const difficulties = Array.from(new Set(wordSet.words.map((w) => w.difficulty))).join(', ');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/word-sets" className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to vocabulary
      </Link>

      <PageHeader
        eyebrow="Vocabulary Set details"
        title={wordSet.title}
        description={wordSet.description}
      />

      <div className="mb-8 mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
            {categories}
          </span>
          <span className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700">
            {difficulties}
          </span>
        </div>
        
        {/* Call-to-action button */}
        <Link 
          href={`/training/${wordSet.id}`}
          className="inline-flex justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Start Training
        </Link>
      </div>

      {/* Word Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">English Word</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ukrainian Translation</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Example Sentence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {wordSet.words.map((word) => (
              <tr key={word.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{word.englishWord}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{word.ukrainianTranslation}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{word.exampleSentence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}