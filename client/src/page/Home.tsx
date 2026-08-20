import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Menu,
  MessageSquareText,
  Sparkles,
  Users2,
  Zap,
} from "lucide-react";
import Logo from "@/components/logo";

const features = [
  { icon: Zap, title: "Move with momentum", description: "Turn plans into assigned, prioritized work without adding process overhead." },
  { icon: Users2, title: "One shared context", description: "Projects, decisions, owners, and updates stay visible to the whole team." },
  { icon: BarChart3, title: "See progress clearly", description: "Know what is moving, what is blocked, and where attention is needed." },
];

const tasks = [
  ["Finalize onboarding flow", "In review", "bg-blue-100 text-blue-700"],
  ["Ship team analytics", "In progress", "bg-amber-100 text-amber-700"],
  ["Update launch brief", "Done", "bg-emerald-100 text-emerald-700"],
];

export default function Home() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <span className="rounded-xl bg-[#4F46E5] p-2 text-white shadow-lg shadow-indigo-600/20"><Logo /></span> TeamNova
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-slate-950">Features</a>
          <a href="#workflow" className="hover:text-slate-950">How it works</a>
          <a href="#about" className="hover:text-slate-950">Why TeamNova</a>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/sign-in" className="rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-slate-100">Sign in</Link>
          <Link to="/sign-up" className="rounded-full bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5 hover:bg-[#4338CA]">Start for free</Link>
        </div>
        <Link to="/sign-in" aria-label="Open sign in" className="rounded-lg p-2 sm:hidden"><Menu /></Link>
      </nav>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-24">
        <div className="absolute left-0 top-10 -z-0 size-72 rounded-full bg-[#4F46E5]/15 blur-3xl" />
        <div className="absolute right-0 top-24 -z-0 size-72 rounded-full bg-[#7C3AED]/15 blur-3xl" />
        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#4F46E5] shadow-sm">
            <Sparkles className="size-4" /> A calmer way to get work done
          </div>
          <h1 className="mx-auto mt-7 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem]">
            Big ideas deserve a <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">clear path</span> forward.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-8 text-slate-600 sm:text-xl">
            TeamNova brings projects, tasks, and people into one beautifully simple workspace—so everyone knows what matters next.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/sign-up" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] px-7 py-3.5 font-semibold text-white shadow-xl shadow-indigo-600/25 transition-all hover:-translate-y-0.5 sm:w-auto">Create your workspace <ArrowRight className="size-4" /></Link>
            <a href="#workflow" className="w-full rounded-full border border-[#E2E8F0] bg-white px-7 py-3.5 font-semibold shadow-sm hover:bg-[#F1F5F9] sm:w-auto">See how it works</a>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500"><Check className="size-4 text-emerald-600" />No credit card required</p>
        </div>

        <div id="workflow" className="relative mx-auto mt-20 max-w-5xl rounded-[2rem] border border-[#E2E8F0] bg-white p-3 text-left shadow-[0_35px_100px_-35px_rgba(15,23,42,0.3)] sm:p-5">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9]">
            <div className="flex items-center justify-between border-b bg-white px-5 py-4">
              <div><p className="text-sm font-semibold">Launch workspace</p><p className="text-xs text-slate-400">12 members · 3 active projects</p></div>
              <div className="flex -space-x-2">{["AM", "JR", "SK"].map((name, index) => <span key={name} className={`grid size-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white ${["bg-blue-600", "bg-emerald-500", "bg-cyan-600"][index]}`}>{name}</span>)}</div>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[0.7fr_1.3fr] md:p-6">
              <div className="rounded-2xl bg-[#0F172A] p-6 text-white">
                <p className="text-sm text-slate-400">Weekly velocity</p><p className="mt-2 text-4xl font-semibold">84%</p>
                <div className="mt-8 flex h-28 items-end gap-2">{[45, 68, 52, 83, 72, 94, 84].map((height, index) => <span key={index} className="flex-1 rounded-t bg-gradient-to-t from-[#4F46E5] to-[#06B6D4]" style={{ height: `${height}%` }} />)}</div>
              </div>
              <div className="rounded-2xl border bg-white p-5">
                <div className="mb-4 flex items-center justify-between"><p className="font-semibold">Today&apos;s priorities</p><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">3 tasks</span></div>
                <div className="space-y-3">{tasks.map(([task, status, color]) => <div key={task} className="flex items-center justify-between rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-3"><CheckCircle2 className="size-5 text-slate-300" /><span className="text-sm font-medium">{task}</span></div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{status}</span></div>)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#0F172A] px-5 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#06B6D4]">Everything in sync</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Built for clarity at every stage.</h2></div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, description }, index) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-7"><span className={`grid size-12 place-items-center rounded-2xl text-white ${["bg-[#4F46E5]", "bg-[#7C3AED]", "bg-[#06B6D4]"][index]}`}><Icon className="size-5" /></span><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-400">{description}</p></article>)}</div>
        </div>
      </section>

      <section id="about" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4F46E5]">Designed for people</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Powerful enough for leaders. Simple enough for everyone.</h2><p className="mt-6 text-lg leading-8 text-[#64748B]">Spend less time maintaining your project tool and more time doing the work it was meant to support.</p></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl bg-blue-100 p-7"><Clock3 className="size-7 text-blue-700" /><p className="mt-12 text-3xl font-semibold">4.2 hrs</p><p className="mt-2 text-sm text-blue-800">saved per teammate, every week</p></div><div className="rounded-3xl bg-emerald-100 p-7 sm:translate-y-8"><MessageSquareText className="size-7 text-emerald-700" /><p className="mt-12 text-3xl font-semibold">32%</p><p className="mt-2 text-sm text-emerald-800">fewer status meetings</p></div></div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8"><div className="mx-auto max-w-7xl rounded-[2.5rem] bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] px-6 py-16 text-center text-white shadow-xl shadow-indigo-600/15 sm:px-12"><h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Ready to find your team&apos;s flow?</h2><p className="mx-auto mt-5 max-w-xl text-lg text-indigo-50">Create your workspace today and turn scattered effort into shared momentum.</p><Link to="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-[#4F46E5] shadow-xl hover:bg-[#F8FAFC]">Start for free <ArrowRight className="size-4" /></Link></div></section>

      <footer className="border-t px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row"><div className="flex items-center gap-2 font-semibold text-slate-900"><Logo /> TeamNova</div><p>© 2026 TeamNova. Built for better work.</p></div></footer>
    </main>
  );
}
