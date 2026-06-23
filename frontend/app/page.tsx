"use client";

import Link from "next/link";
import { useUser } from "@/app/_lib/UserContext";

export default function HomePage() {
  const { user, loading, logout } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Subtle grid texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Nav bar */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500 shadow-md shadow-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              Nex<span className="text-indigo-400">Talk</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {loading ? (
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/change-password"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Security
                </Link>
                <div className="w-8 h-8 rounded-full border border-indigo-500/30 overflow-hidden bg-slate-800 shadow-md">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-400">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-full transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main hero section */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 md:py-32 flex flex-col items-start gap-8">
        <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
          NexTalk chat application
        </div>
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            {user ? `Welcome back, ${user.fullName}!` : "Connect and chat in real time."}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed">
            {user
              ? "You are logged in successfully. Navigate to your Profile to change your avatar, name, or update your password settings."
              : "Discover the scaffolded NexTalk client. Experience smooth authentication, beautiful profile customizing, and secure password updates."}
          </p>
        </div>

        {!loading && !user && (
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/register"
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-150"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:scale-[1.02] transition-all duration-150"
            >
              Sign In
            </Link>
          </div>
        )}

        {!loading && user && (
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/profile"
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-150"
            >
              Edit Profile
            </Link>
            <Link
              href="/change-password"
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:scale-[1.02] transition-all duration-150"
            >
              Change Password
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
