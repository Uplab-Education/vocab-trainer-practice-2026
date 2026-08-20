"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { WordSetCard, type DBWordSetCardProps } from "@/components/WordSetCard";

export function WordSetsClient({ wordSets }: { wordSets: DBWordSetCardProps[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = wordSets.filter((set) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = set.title.toLowerCase().includes(query);
    
    /*Filter by category if the search query matches any category in the set's words*/
    const allCategories = set.words?.map(w => w.category?.toLowerCase()).join(' ') || "";
    const matchesCategory = allCategories.includes(query);
    
    return matchesTitle || matchesCategory;
  });;

  return (
    <>
      {/* Block with search field */}
      <div className="mb-8 mt-6 max-w-sm">
        {/* Label for accessibility */}
        <label htmlFor="word-set-search" className="sr-only">
          Search word sets
        </label>
        <input
          id="word-set-search"
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Render the list or EmptyState if nothing is found */}
      {filteredSets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSets.map((set) => (
            <WordSetCard key={set.id} wordSet={set} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={wordSets.length === 0 ? "No word sets available" : "No word sets found"}
          description={
            wordSets.length === 0
              ? "Your vocabulary library is currently empty. Please add some word sets to get started."
              : `We couldn't find any sets matching "${searchQuery}". Try a different search term.`
          }
        />
      )}
    </>
  );
}