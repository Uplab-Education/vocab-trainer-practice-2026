"use client";

import { useState } from "react";

export type WordSetFormData = {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "";
};

type WordSetFormProps = {
  initialData?: WordSetFormData;
  isEditMode?: boolean;
};

export function WordSetForm({ initialData, isEditMode = false }: WordSetFormProps) {
  // Ініціалізуємо стан значеннями з initialData (якщо це режим редагування) або порожніми рядками
  const [formData, setFormData] = useState<WordSetFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    difficulty: initialData?.difficulty || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WordSetFormData, string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Клієнтська валідація
  const validate = () => {
    const newErrors: Partial<Record<keyof WordSetFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Повертає true, якщо помилок немає
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    if (validate()) {
      // Імітація локального збереження (без бази даних)
      console.log("Local submit success:", formData);
      setIsSuccess(true);
      
      // Очищаємо форму тільки якщо це створення нового набору
      if (!isEditMode) {
        setFormData({ title: "", description: "", category: "", difficulty: "" });
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {/* Local Success State */}
      {isSuccess && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Successfully {isEditMode ? "updated" : "created"} the word set! (Local mode)
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-900">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`mt-2 block w-full rounded-md border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} px-3 py-2 text-sm focus:outline-none focus:ring-1`}
            placeholder="e.g., Basic Greetings"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-900">Description</label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`mt-2 block w-full rounded-md border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} px-3 py-2 text-sm focus:outline-none focus:ring-1`}
            placeholder="Briefly describe the vocabulary set..."
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-900">Category</label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`mt-2 block w-full rounded-md border ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} px-3 py-2 text-sm focus:outline-none focus:ring-1`}
            placeholder="e.g., Travel, Food, Business"
          />
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>

        {/* Difficulty Field */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-slate-900">Difficulty</label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as WordSetFormData["difficulty"] })}
            className={`mt-2 block w-full rounded-md border ${errors.difficulty ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1`}
          >
            <option value="" disabled>Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {errors.difficulty && <p className="mt-1 text-xs text-red-500">{errors.difficulty}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            {isEditMode ? "Save Changes" : "Create Word Set"}
          </button>
        </div>
      </form>
    </div>
  );
}