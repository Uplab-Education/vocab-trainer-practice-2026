import { Button } from "@/components/ui/button";

type TrainingSummaryProps = {
  score: number;
  total: number;
  wordSetId: string;
};

export function TrainingSummary({ score, total, wordSetId }: TrainingSummaryProps) {
  return (
    <div className="mx-auto max-w-xl text-center py-16">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Training Complete!</h2>
      <p className="text-lg text-slate-600 mb-8">
        You scored <span className="font-bold text-slate-900">{score}</span> out of {total}.
      </p>
      <Button asChild href={`/word-sets/${wordSetId}`}>
        Back to Word Set
      </Button>
    </div>
  );
}