import Link from "next/link";

export type DBWordSetCardProps = {
  id: string;
  title: string;
  description?: string | null;
  words?: {
    category?: string | null;
    difficulty?: string | null;
  }[];
};

export function WordSetCard({ wordSet }: { wordSet: DBWordSetCardProps }) {
  /*Count the number of words in the set, defaulting to 0 if undefined*/
  const wordCount = wordSet.words?.length || 0;
  
  // Витягуємо унікальні категорії та складності
  const categories = Array.from(
    new Set(wordSet.words?.map((w) => w.category).filter(Boolean))
  ).join(', ');
  
  const difficulties = Array.from(
    new Set(wordSet.words?.map((w) => w.difficulty).filter(Boolean))
  ).join(', ');

  return (
    <Link
      href={`/word-sets/${wordSet.id}`}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
    >
      <div>
        <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-blue-600">
          {wordSet.title}
        </h3>
        {/* Виводимо опис, якщо він є */}
        {wordSet.description && (
          <p className="mb-4 text-sm text-slate-600 line-clamp-2">
            {wordSet.description}
          </p>
        )}
      </div>
      
      {/* Виводимо нові бейджики замість старого "Study Set" */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {wordCount} words
        </span>
        
        {categories && (
          <span className="inline-flex max-w-37.5 items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <span className="truncate">{categories}</span>
          </span>
        )}
        
        {difficulties && (
          <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {difficulties}
          </span>
        )}
      </div>
    </Link>
  );
}