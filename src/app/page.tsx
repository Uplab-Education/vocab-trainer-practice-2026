import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

export default function Home() {
  const activity = [
    { label: "Business English", value: "24 words", status: "Active" },
    { label: "Travel basics", value: "18 words", status: "Due today" },
    { label: "Academic terms", value: "32 words", status: "New" },
  ];

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

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Daily goal" value="10" helper="words per day" trend="+2" />
        <StatCard label="Accuracy" value="86%" helper="last 7 sessions" trend="+8%" />
        <StatCard label="Active sets" value="4" helper="currently learning" />
        <StatCard label="Hard words" value="12" helper="need repetition" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold">Today&apos;s learning plan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Short sessions designed for steady vocabulary retention.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {activity.map((item) => (
              <div className="flex items-center justify-between gap-4 px-5 py-4" key={item.label}>
                <div>
                  <p className="font-medium text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {item.status}
                </span>
              </div>
            ))}
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
