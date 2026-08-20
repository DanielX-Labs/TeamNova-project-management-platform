import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "@/components/logo";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

const outcomes = [
  "Plan projects in one shared workspace",
  "Keep owners, tasks, and deadlines clear",
  "See progress without status meetings",
];

export default function AuthShell({ children, eyebrow, title, description }: AuthShellProps) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]" />
      <div className="pointer-events-none absolute -left-40 top-24 size-96 rounded-full bg-[#4F46E5]/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-16 size-96 rounded-full bg-[#06B6D4]/[0.08] blur-3xl" />

      <nav className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-[-0.02em]">
          <span className="grid size-10 place-items-center rounded-xl bg-[#4F46E5] text-white shadow-lg shadow-indigo-600/20"><Logo /></span>
          TeamNova
        </Link>
        <Link to="/" className="group flex items-center gap-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Back to homepage
        </Link>
      </nav>

      <div className="relative mx-auto grid min-h-[calc(100svh-80px)] max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm font-semibold text-[#4F46E5] shadow-sm">
            <Sparkles className="size-4" /> Built for focused teams
          </div>
          <h2 className="mt-7 max-w-lg text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#0F172A]">
            One place to move work forward.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#64748B]">
            Bring projects, tasks, and teammates into a workspace designed for clarity from day one.
          </p>
          <div className="mt-9 space-y-4">
            {outcomes.map((outcome) => (
              <div key={outcome} className="flex items-center gap-3 text-sm font-medium text-[#334155]">
                <span className="grid size-6 place-items-center rounded-full bg-[#10B981]/10 text-[#10B981]"><Check className="size-4" /></span>
                {outcome}
              </div>
            ))}
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            {[['10k+', 'teams'], ['99.9%', 'uptime'], ['4.9/5', 'rating']].map(([value, label]) => (
              <div key={label} className="px-4 first:pl-0 last:pr-0">
                <p className="text-xl font-semibold text-[#0F172A]">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-[#64748B]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.25)] sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5]">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#0F172A] sm:text-4xl">{title}</h1>
              <p className="mt-3 leading-7 text-[#64748B]">{description}</p>
            </div>
            <span className="hidden rounded-xl bg-[#F1F5F9] p-2.5 text-[#4F46E5] sm:block"><ShieldCheck className="size-5" /></span>
          </div>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
