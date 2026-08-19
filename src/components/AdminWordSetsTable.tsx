import Link from "next/link";
import { db } from "@/db";
import { deleteWordSet } from "@/app/admin/actions"; 

export async function AdminWordSetsTable() {
  /*Fetch all word sets along with their associated words, ordered by creation date (newest first)*/
  const allSets = await db.query.wordSets.findMany({
    with: { words: true },
    orderBy: (wordSets, { desc }) => [desc(wordSets.createdAt)],
  });

  return (
    <div className="mt-8">
      {/*Controls*/}
      <div className="mb-6 flex gap-4">
        <Link 
          href="/admin/create" 
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          + Create New Set
        </Link>
        <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50">
          Import CSV
        </button>
      </div>

      {/*Table*/}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
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
            {allSets.map((set) => {
              /*Collect unique difficulties and categories for display*/
              const difficulties = Array.from(new Set(set.words.map(w => w.difficulty).filter(Boolean))).join(', ') || '—';
              const categories = Array.from(new Set(set.words.map(w => w.category).filter(Boolean))).join(', ') || '—';
              
              /*Format the date (e.g., 2026-07-21)*/
              const updatedDate = set.createdAt ? new Date(set.createdAt).toISOString().split('T')[0] : '—';

              return (
                <tr key={set.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{set.title}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{difficulties}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 max-w-50 truncate">{categories}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{set.words.length}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{updatedDate}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-4">
                      {/*Link to the edit page*/}
                      <Link href={`/admin/${set.id}/edit`} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </Link>
                      
                      {/*Button to delete the word set (uses Server Action)*/}
                      <form action={deleteWordSet.bind(null, set.id)}>
                        <button type="submit" className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}