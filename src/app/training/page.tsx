import Link from "next/link";
import { getActiveSessionsForUser } from "@/features/training/db";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireAuth } from "@/auth/session";

export default async function TrainingPage() {
  /*Check if the user is authenticated; if not, redirect to login*/
  const user = await requireAuth();

  /*Fetch all active sessions for the authenticated user from the database*/
  const activeSessions = await getActiveSessionsForUser(user.id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <PageHeader
        eyebrow="Training"
        title="Training"
        description="Practice vocabulary through short focused exercises and resume your active sessions anytime."
      />

      {activeSessions.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Continue Active Sessions</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeSessions.map((session) => {
              const progressPercentage = Math.round((session.currentIndex / session.totalWords) * 100);

              return (
                <Link
                  key={session.id}
                  href={`/training/${session.id}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                >
                  <h3 className="mb-4 text-lg font-bold text-slate-900 group-hover:text-blue-600">
                    {session.title}
                  </h3>
                  
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span className="font-medium text-slate-900">
                      {session.currentIndex} / {session.totalWords} words
                    </span>
                  </div>
                  
                  {/*Progress Bar*/}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="mt-6 flex items-center text-sm font-medium text-slate-500 transition-colors group-hover:text-blue-600">
                    Resume Training 
                    <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No active sessions"
            description="You don't have any training sessions in progress right now. Choose a new word set to begin."
          />
          <div className="mt-6 flex justify-center">
            <Link
              href="/word-sets"
              className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Browse Word Sets
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}