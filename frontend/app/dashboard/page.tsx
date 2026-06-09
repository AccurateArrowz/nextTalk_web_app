import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/40">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold">You are logged in.</h1>
        <p className="mt-4 max-w-xl text-slate-400">
          This is a dummy post-login page so the auth flow has a clear success
          destination.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
