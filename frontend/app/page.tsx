import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
      <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.188-2.737-.535-4.015a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300">
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1.5">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Mock Chat Bubble ─────────────────────────────────────────────────────────

function MockMessage({
  text,
  sender,
  time,
  align = "left",
}: {
  text: string;
  sender: string;
  time: string;
  align?: "left" | "right";
}) {
  const isRight = align === "right";
  return (
    <div
      className={`flex gap-2.5 ${isRight ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
        {sender[0]}
      </div>
      <div
        className={`flex flex-col gap-1 max-w-[75%] ${isRight ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
            isRight
              ? "bg-indigo-600 text-white rounded-tr-sm"
              : "bg-slate-700/80 text-slate-100 rounded-tl-sm"
          }`}
        >
          {text}
        </div>
        <span className="text-[11px] text-slate-500">{time}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white font-sans">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Navbar ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/40">
            <ChatBubbleIcon className="w-4 h-4 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Nex<span className="text-indigo-400">Talk</span>
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-500/30 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-28 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Real-time messaging — no refresh needed
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
          Chat that feels{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            instant.
          </span>
        </h1>
        <p className="max-w-xl text-lg text-slate-400 leading-relaxed mb-10">
          NexTalk brings your conversations to life with real-time messaging,
          presence indicators, and a clean interface built for how you actually
          talk.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm shadow-xl shadow-indigo-500/30 transition-colors"
          >
            Start chatting for free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 font-semibold text-sm transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Mock chat window */}
        <div className="mt-20 w-full max-w-md mx-auto rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-800/60">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              #general
            </div>
          </div>
          {/* Messages */}
          <div className="flex flex-col gap-4 px-5 py-5">
            <MockMessage
              sender="Alex"
              text="Hey! Just shipped the new feature 🚀"
              time="2:41 PM"
              align="left"
            />
            <MockMessage
              sender="You"
              text="Awesome! Already testing it, looks great 👏"
              time="2:42 PM"
              align="right"
            />
            <MockMessage
              sender="Alex"
              text="Thanks! Let me know if you spot any bugs."
              time="2:42 PM"
              align="left"
            />
          </div>
          {/* Input bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-700/60 bg-slate-800/40">
            <div className="flex-1 rounded-full bg-slate-700/60 px-4 py-2 text-sm text-slate-500">
              Message #general…
            </div>
            <button
              aria-label="Send"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-white rotate-90"
              >
                <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="relative z-10 px-6 py-24 max-w-6xl mx-auto"
      >
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to stay connected
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Built with speed and simplicity in mind, NexTalk gives you the tools
            to communicate without the clutter.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            icon={<BoltIcon className="w-5 h-5 text-indigo-400" />}
            title="Instant delivery"
            description="Messages arrive in real time — no polling, no lag, no page reloads."
          />
          <FeatureCard
            icon={<ShieldIcon className="w-5 h-5 text-indigo-400" />}
            title="Secure by default"
            description="End-to-end encryption and secure auth keep your conversations private."
          />
          <FeatureCard
            icon={<UsersIcon className="w-5 h-5 text-indigo-400" />}
            title="Group channels"
            description="Create rooms for teams, friends, or topics — invite anyone in seconds."
          />
          <FeatureCard
            icon={<GlobeIcon className="w-5 h-5 text-indigo-400" />}
            title="Works everywhere"
            description="Fully responsive — pick up the conversation on any device, anywhere."
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        className="relative z-10 px-6 py-24 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Up and running in seconds
        </h2>
        <p className="text-slate-400 mb-16">
          No downloads, no setup. Just sign up and start talking.
        </p>
        <ol className="flex flex-col gap-6 text-left">
          {[
            {
              step: "1",
              title: "Create your account",
              desc: "Register with your email in under a minute.",
            },
            {
              step: "2",
              title: "Join or create a channel",
              desc: "Start a room or hop into an existing one with a simple invite link.",
            },
            {
              step: "3",
              title: "Start the conversation",
              desc: "Send messages, react, and see replies appear instantly.",
            },
          ].map(({ step, title, desc }) => (
            <li
              key={step}
              className="flex gap-5 items-start rounded-2xl border border-slate-700/50 bg-slate-900/60 px-6 py-5 hover:border-indigo-500/30 transition-colors"
            >
              <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/30 text-sm font-bold text-indigo-400">
                {step}
              </span>
              <div>
                <p className="font-semibold text-white mb-0.5">{title}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 py-20 max-w-2xl mx-auto text-center">
        <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 px-8 py-14 backdrop-blur-sm">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to connect?
          </h2>
          <p className="text-slate-400 mb-8">
            Join NexTalk today — it&apos;s free to get started.
          </p>
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-slate-300 mb-10">
            {["Free account", "No credit card required", "Instant access"].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm shadow-xl shadow-indigo-500/30 transition-colors"
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/20">
            <ChatBubbleIcon className="w-3 h-3 text-indigo-400" />
          </span>
          <span className="font-semibold text-slate-300">
            Nex<span className="text-indigo-400">Talk</span>
          </span>
        </div>
        <p>
          © {new Date().getFullYear()} NexTalk. Built for real conversations.
        </p>
      </footer>
    </div>
  );
}
