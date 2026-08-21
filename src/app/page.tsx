import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardStats } from "@/features/dashboard/db";
import { getActiveSessionsForUser } from "@/features/training/db";
import { requireAuth } from "@/auth/session";

export default async function Home() {
  /*Check if the user is authenticated; if not, redirect to login*/
  const user = await requireAuth();

  /*Fetch dashboard statistics and active sessions*/
  const stats = await getDashboardStats(user.id);
  const activeSessions = await getActiveSessionsForUser(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Learn English through focused daily practice"
        description="Choose vocabulary sets, complete short interactive sessions, and track progress from one personal dashboard."
      >
        <Button asChild href="/word-sets">
          Browse word sets
        </Button>
        <Button asChild href="/training" variant="secondary">
          Start training
        </Button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Learned Words" value={stats.learnedWords.toString()} helper="Total words mastered" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} helper="All-time average" />
        <StatCard label="Daily Goal" value={`${stats.wordsPracticedToday} / 20`} helper="Words practiced today" />
        <StatCard label="Active Sets" value={stats.activeSets.toString()} helper="Sets currently in rotation" />
        <StatCard label="Needs Review" value={stats.needsReview.toString()} helper="Words you struggle with" />
      </section>

      <section className="grid gap-6 mt-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold">Today&apos;s learning plan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Short sessions designed for steady vocabulary retention.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => (
                <div className="flex items-center justify-between gap-4 px-5 py-4" key={session.id}>
                  <div>
                    <p className="font-medium text-slate-950">{session.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Progress: {session.currentIndex} / {session.totalWords} words
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-medium">
                    Active
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                You don&apos;t have any active training sessions right now. 
                <br/>
                Go to Word Sets to start learning!
              </div>
            )}
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold">Practice formats</h2>
          <div className="mt-4 space-y-3">
            {["English to Ukrainian", "Ukrainian to English", "Word constructor"].map(
              (mode) => (
                <div className="rounded-md border border-slate-200 p-3" key={mode}>
                  <p className="text-sm font-medium text-slate-950">{mode}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Focused exercise with instant feedback.
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      </section>
    </>
  );
}