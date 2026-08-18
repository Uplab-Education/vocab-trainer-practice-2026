import Link from "next/link";

type DBWordSetCardProps = {
  id: string;
  title: string;
  createdAt: Date | string;
};

export function WordSetCard({ wordSet }: { wordSet: DBWordSetCardProps }) {
  return (
    <Link
      href={`/word-sets/${wordSet.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
    >
      <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-blue-600">
        {wordSet.title}
      </h3>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
          Study Set
        </span>
        <span className="text-sm font-medium text-slate-500 max-w-37.5 truncate">
          View &rarr;
        </span>
      </div>
    </Link>
  );
}