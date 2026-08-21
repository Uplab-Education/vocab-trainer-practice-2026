import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/features/dashboard/db";
import { requireAuth } from "@/auth/session";

export default async function DashboardPage() {
  /*Check if the user is authenticated; if not, redirect to login*/
  const user = await requireAuth();

  /*Get dashboard stats for the current user*/
  const data = await getDashboardStats(user.id);

  /*Check if the user has ANY active metrics*/
  const hasProgress = 
    data.learnedWords > 0 || 
    data.recentSessions.length > 0 ||
    data.activeSets > 0 ||
    data.needsReview > 0 ||
    data.wordsPracticedToday > 0;

  /*Format date for display in the recent sessions table*/
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Dashboard"
        description="Track learned words, accuracy, daily goals, active sets, hard words, and recent sessions."
      />

      {!hasProgress ? (
        <div className="mt-8">
          <EmptyState
            title="No progress yet"
            description="Complete training sessions to see progress, accuracy, and difficult words here."
          />
          <div className="mt-6 flex justify-center">
            <Button asChild href="/word-sets">
              Browse Word Sets &rarr;
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              label="Learned Words" 
              value={data.learnedWords.toString()} 
              helper="Total words mastered"
            />
            <StatCard 
              label="Accuracy" 
              value={`${data.accuracy}%`} 
              helper="All-time average" 
            />
            <StatCard 
              label="Daily Goal" 
              value={`${data.wordsPracticedToday} / 20`} 
              helper="Words practiced today" 
            />
            <StatCard
              label="Active Sets"
              value={data.activeSets.toString()}
              helper="Sets currently in rotation"
            />
            <StatCard 
              label="Needs Review" 
              value={data.needsReview.toString()} 
              helper="Words you struggle with" 
            />
          </div>

          {/*Recent Sessions Table*/}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Training Sessions</h3>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {data.recentSessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Word Set</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {data.recentSessions.map((session) => (
                        <tr key={session.id} className="hover:bg-slate-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{formatDate(session.date)}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{session.wordSetTitle}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-blue-600">{session.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-sm text-slate-500">
                  No recent sessions found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}