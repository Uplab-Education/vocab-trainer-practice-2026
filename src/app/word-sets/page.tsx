"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { starterWordSets } from "@/features/word-sets/data";
import { WordSetCard } from "@/components/WordSetCard";

export default function WordSetsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  /*Filter the word sets by title or word category*/
  const filteredSets = starterWordSets.filter((set) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = set.title.toLowerCase().includes(query);
    const matchesCategory = set.words.some((word) =>
      word.category.toLowerCase().includes(query)
    );
    
    return matchesTitle || matchesCategory;
  });

  return (
    <>
      <PageHeader
        eyebrow="Vocabulary"
        title="Word Sets"
        description="Browse curated vocabulary sets by topic, difficulty, and learning goal."
      />

      {/*Block with search field*/}
      <div className="mb-8 mt-6 max-w-sm">
        {/*Label for accessibility*/}
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

      {/*Render the list or EmptyState if nothing is found*/}
      {filteredSets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSets.map((set) => (
            <WordSetCard key={set.id} wordSet={set} />
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