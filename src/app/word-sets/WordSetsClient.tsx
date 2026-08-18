"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { WordSetCard } from "@/components/WordSetCard";

// Using 'any' or defining a specific type for the DB word set
type DBWordSet = {
  id: string;
  title: string;
  createdAt: Date | string;
};

export function WordSetsClient({ wordSets }: { wordSets: DBWordSet[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  /* Filter the word sets by title only (since words/categories aren't loaded here for performance) */
  const filteredSets = wordSets.filter((set) => {
    return set.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Render the list or EmptyState if nothing is found */}
      {filteredSets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSets.map((set) => (
            // Note: You might need to update WordSetCard to handle the new DB structure 
            // if it expects properties that no longer exist (like word count or category).
            <WordSetCard key={set.id} wordSet={set as any} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No word sets found"
          description={`We couldn't find any sets matching "${searchQuery}". Try a different search term.`}
        />
      )}
    </>
  );
}