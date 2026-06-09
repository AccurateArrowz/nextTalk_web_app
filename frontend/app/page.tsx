import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-8">
        <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
          NextTalk auth scaffold
        </div>
        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold tracking-tight">
            Register, sign in, and land on the dashboard.
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            This home page is now a clean entry point into the auth flow. No
            default Next.js branding, no template footer.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
