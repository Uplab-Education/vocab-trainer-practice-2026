type TrainingProgressProps = {
  title: string;
  current: number;
  total: number;
};

export function TrainingProgress({ title, current, total }: TrainingProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
        <span>{title}</span>
        <span>{current} / {total}</span>
      </div>
      <div 
        className="w-full bg-slate-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Training progress"
      >
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}