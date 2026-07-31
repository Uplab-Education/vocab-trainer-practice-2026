"use client";

import { starterWordSets } from "@/features/word-sets/data";
import Link from "next/link";

export function AdminWordSetsTable() {
  return (
    <div className="mt-8">
      {/*Global Actions:*/}
      {/*Create & Import*/}
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          href="/admin/create"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          + Create New Set
        </Link>
        <button
          onClick={() => alert("Import CSV action triggered (local mode)")}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          Import CSV
        </button>
      </div>

      {/*Admin Table*/}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Difficulty</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Words</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Updated</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {starterWordSets.map((set) => {
                const categories = Array.from(new Set(set.words.map((w) => w.category))).join(', ');
                const difficulties = Array.from(new Set(set.words.map((w) => w.difficulty))).join(', ');
                const wordCount = set.words.length;
                const mockUpdatedDate = "2026-07-21";

                return (
                  <tr key={set.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{set.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="truncate max-w-[120px] block">{difficulties}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="truncate max-w-[150px] block">{categories}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{wordCount}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{mockUpdatedDate}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/${set.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => alert(`Delete ${set.id} triggered (local mode)`)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}