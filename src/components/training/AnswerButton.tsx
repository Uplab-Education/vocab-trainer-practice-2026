import { CheckIcon, CrossIcon } from "@/components/ui/icons";
import { checkAnswer } from "@/features/training/logic";

export type AnswerState = "idle" | "correct" | "incorrect" | "muted";

type AnswerButtonProps = {
  option: string;
  state: AnswerState;
  onSelect: (option: string) => void;
};

// Function to determine the state of the answer option
export function getAnswerState(option: string, selectedAnswer: string | null, correctTranslation: string): AnswerState {
  if (!selectedAnswer) return "idle";
  if (checkAnswer(option, correctTranslation)) return "correct";
  if (option === selectedAnswer) return "incorrect";
  return "muted";
}

export function AnswerButton({ option, state, onSelect }: AnswerButtonProps) {
  let buttonStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300";
  let icon = null;

  if (state === "correct") {
    buttonStyle = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
    icon = <CheckIcon className="ml-2 h-6 w-6" />;
  } else if (state === "incorrect") {
    buttonStyle = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
    icon = <CrossIcon className="ml-2 h-6 w-6" />;
  } else if (state === "muted") {
    buttonStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed";
  }

  const isSelected = state === "correct" || state === "incorrect";

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={state !== "idle"}
      aria-pressed={isSelected}
      className={`flex items-center justify-center px-6 py-4 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${buttonStyle}`}
    >
      <span>{option}</span>
      {icon}
    </button>
  );
}