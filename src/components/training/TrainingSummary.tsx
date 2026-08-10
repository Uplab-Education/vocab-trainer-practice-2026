import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Word } from "@/features/word-sets/data";

export type AnswerRecord = {
  word: Word;
  selected: string;
  isCorrect: boolean;
};

type TrainingSummaryProps = {
  results: AnswerRecord[];
  total: number;
  wordSetId: string;
  onRetry: () => void;
};

export function TrainingSummary({ results, total, wordSetId, onRetry }: TrainingSummaryProps) {
  const correctCount = results.filter(r => r.isCorrect).length;
  const incorrectCount = total - correctCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-slate-900">Training Complete!</h2>
        <p className="text-slate-600">Here is your performance summary for this session.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Questions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Correct</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">{correctCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Incorrect</p>
          <p className="mt-2 text-3xl font-semibold text-red-600">{incorrectCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Accuracy</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{accuracy}%</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Word</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Your Answer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Correct Translation</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{r.word.englishWord}</td>
                  <td className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${r.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {r.selected}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{r.word.ukrainianTranslation}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    {r.isCorrect ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Correct</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Incorrect</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button onClick={onRetry} className="w-full sm:w-auto">
          Retry Session
        </Button>
        <Link
          href={`/word-sets/${wordSetId}`}
          className="w-full inline-flex justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          Back to Word Set
        </Link>
      </div>
    </div>
  );
}