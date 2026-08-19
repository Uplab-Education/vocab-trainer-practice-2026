"use client";

import { useState } from "react";
import { createWordSet, updateWordSet } from "@/app/admin/actions";

export type WordSetFormData = {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "";
  words: { englishWord: string; ukrainianTranslation: string; exampleSentence: string }[];
};

type WordSetFormProps = {
  initialData?: WordSetFormData;
  isEditMode?: boolean;
  wordSetId?: string;
};

export function WordSetForm({ initialData, isEditMode = false, wordSetId }: WordSetFormProps) {
  const [formData, setFormData] = useState<WordSetFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    difficulty: initialData?.difficulty || "",
    words: initialData?.words && initialData.words.length > 0 
      ? initialData.words 
      : [{ englishWord: "", ukrainianTranslation: "", exampleSentence: "" }],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WordSetFormData, string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Partial<Record<keyof WordSetFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    
    /*Validate words: at least one word must be filled*/
    const validWords = formData.words.filter(w => w.englishWord.trim() && w.ukrainianTranslation.trim());
    if (validWords.length === 0) {
      newErrors.words = "Please add at least one valid word (English + Ukrainian)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addWordRow = () => {
    setFormData({
      ...formData,
      words: [...formData.words, { englishWord: "", ukrainianTranslation: "", exampleSentence: "" }]
    });
  };

  const removeWordRow = (indexToRemove: number) => {
    setFormData({
      ...formData,
      words: formData.words.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleWordChange = (index: number, field: keyof WordSetFormData["words"][0], value: string) => {
    const newWords = [...formData.words];
    newWords[index][field] = value;
    setFormData({ ...formData, words: newWords });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    if (validate()) {
      setIsLoading(true);
      
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("difficulty", formData.difficulty);
      
      /*Filter out empty rows and pass words as a JSON string*/
      const validWords = formData.words.filter(w => w.englishWord.trim() && w.ukrainianTranslation.trim());
      data.append("words", JSON.stringify(validWords));

      if (isEditMode && wordSetId) {
        await updateWordSet(wordSetId, data);
      } else {
        await createWordSet(data);
      }

      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {isSuccess && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Successfully {isEditMode ? "updated" : "created"} the word set!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/*Basic Fields*/}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-900">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`mt-2 block w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-slate-300'} px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={isLoading}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-900">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`mt-2 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-slate-300'} px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`mt-2 block w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-slate-300'} px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as WordSetFormData["difficulty"] })}
              className={`mt-2 block w-full rounded-md border ${errors.difficulty ? 'border-red-500' : 'border-slate-300'} bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={isLoading}
            >
              <option value="" disabled>Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/*Words Section*/}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-900">Words in this Set</h3>
            <button
              type="button"
              onClick={addWordRow}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              + Add Word
            </button>
          </div>

          {errors.words && <p className="mb-4 text-sm text-red-500">{errors.words}</p>}

          <div className="space-y-4">
            {formData.words.map((word, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-md bg-slate-50 p-4 sm:flex-row sm:items-start">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="English Word"
                      value={word.englishWord}
                      onChange={(e) => handleWordChange(index, "englishWord", e.target.value)}
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      placeholder="Ukrainian Translation"
                      value={word.ukrainianTranslation}
                      onChange={(e) => handleWordChange(index, "ukrainianTranslation", e.target.value)}
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Example Sentence (Optional)"
                    value={word.exampleSentence}
                    onChange={(e) => handleWordChange(index, "exampleSentence", e.target.value)}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                {formData.words.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWordRow(index)}
                    className="mt-1 text-sm text-red-500 hover:text-red-700 sm:mt-0 sm:p-2"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/*Save Button*/}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : (isEditMode ? "Save Changes" : "Create Word Set")}
          </button>
        </div>
      </form>
    </div>
  );
}