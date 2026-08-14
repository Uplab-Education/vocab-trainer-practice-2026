import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import {starterProgressData, type RecentSession} from "@/features/progress/data";
//import {emptyProgressData, type RecentSession} from "@/features/progress/data";

export default function DashboardPage() {
  /*Toggle this variable to test the empty state: const data = emptyProgressData; */
  const data = starterProgressData;
  /*Check if the user has any progress*/
  const hasProgress = data.learnedWords > 0 || data.recentSessions.length > 0;

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
            {/*Using the shared Button component as a Link for consistency*/}
            <Button asChild href="/word-sets">
              Browse Word Sets &rarr;
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {/*Stats Grid using your existing StatCard component*/}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              label="Learned Words" 
              value={data.learnedWords.toString()} 
              helper="Total words mastered"
              trend="+12 this week"
            />
            <StatCard 
              label="Accuracy" 
              value={`${data.accuracy}%`} 
              helper="All-time average" 
            />
            <StatCard 
              label="Daily Goal" 
              value={`${data.dailyGoal.current} / ${data.dailyGoal.target}`} 
              helper="Words practiced today" 
            />
            <StatCard 
              label="Needs Review" 
              value={data.hardWords.toString()} 
              helper="Words you struggle with" 
            />
          </div>

          {/*Recent Sessions Table*/}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Training Sessions</h3>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
                    {data.recentSessions.map((session: RecentSession) => (
                      <tr key={session.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{session.date}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{session.setName}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-blue-600">{session.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}