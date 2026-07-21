import Link from 'next/link';
import { WordSet } from '@/features/word-sets/data';

type WordSetCardProps = {
  wordSet: WordSet;
};

export function WordSetCard({ wordSet }: WordSetCardProps) {
  const wordCount = wordSet.words.length;
  
  /*Get unique categories and difficulties from the words in the word set*/
  const categories = Array.from(new Set(wordSet.words.map(w => w.category))).join(', ');
  const difficulties = Array.from(new Set(wordSet.words.map(w => w.difficulty))).join(', ');

  return (
    <Link href={`/word-sets/${wordSet.id}`} className="block h-full">
      <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
        <h3 className="text-lg font-semibold text-slate-950">{wordSet.title}</h3>
        <p className="mt-2 flex-grow text-sm text-slate-600">{wordSet.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700">
            {wordCount} words
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-700 truncate max-w-[150px]">
            {categories}
          </span>
          <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-orange-700">
            {difficulties}
          </span>
        </div>
      </article>
    </Link>
  );
}