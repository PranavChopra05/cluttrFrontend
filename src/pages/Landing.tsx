import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  LuBrain,
  LuSearch,
  LuMessageSquare,
  LuShare2,
  LuTags,
  LuFolders,
  LuStar,
  LuLink,
} from "react-icons/lu";
import { HiSparkles, HiArrowRight, HiCheck } from "react-icons/hi2";
import {
  FaYoutube,
  FaGithub,
  FaRedditAlien,
  FaSpotify,
  FaFigma,
  FaXTwitter,
} from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { Logo, LogoMark } from "../components/Logo";

/* ── Motion presets (subtle, premium — never bouncy) ── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Static data ── */
interface Feature {
  icon: IconType;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: LuSearch,
    title: "AI semantic search",
    desc: "Search by meaning, not keywords. Find that one link even when you only half-remember it.",
  },
  {
    icon: LuMessageSquare,
    title: "Chat with your brain",
    desc: "Ask your saved knowledge anything. Cluttr answers from the links you've collected.",
  },
  {
    icon: LuLink,
    title: "Auto-detected rich embeds",
    desc: "Paste a link and watch it bloom — videos, tweets, repos and tracks render in place.",
  },
  {
    icon: LuTags,
    title: "Tags & collections",
    desc: "Group anything your way. Layer tags and folders to keep every idea exactly where it belongs.",
  },
  {
    icon: LuStar,
    title: "Favorites & instant filtering",
    desc: "Star what matters and filter your whole brain in a keystroke. Zero friction recall.",
  },
  {
    icon: LuShare2,
    title: "Share your brain with a link",
    desc: "Publish a curated, read-only brain and send it to anyone — no account required.",
  },
];

interface Platform {
  icon: IconType;
  label: string;
}

const PLATFORMS: Platform[] = [
  { icon: FaYoutube, label: "YouTube" },
  { icon: FaXTwitter, label: "X" },
  { icon: FaGithub, label: "GitHub" },
  { icon: FaRedditAlien, label: "Reddit" },
  { icon: FaSpotify, label: "Spotify" },
  { icon: FaFigma, label: "Figma" },
  { icon: SiNotion, label: "Notion" },
];

interface Step {
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    title: "Paste a link",
    desc: "Drop in any URL — a video, thread, repo, song, doc or article.",
  },
  {
    title: "Cluttr organizes it",
    desc: "We detect the type, pull a rich preview and make it instantly searchable.",
  },
  {
    title: "Find or ask anything later",
    desc: "Search by meaning or chat with your brain to surface exactly what you need.",
  },
];

/* Faux dashboard preview tiles — type-colored dots reuse the platform glyphs */
interface MockTile {
  icon: IconType;
  color: string;
  w: string;
}

const MOCK_TILES: MockTile[] = [
  { icon: FaYoutube, color: "text-danger", w: "w-3/4" },
  { icon: FaGithub, color: "text-fg", w: "w-2/3" },
  { icon: FaXTwitter, color: "text-fg", w: "w-4/5" },
  { icon: FaSpotify, color: "text-success", w: "w-1/2" },
  { icon: SiNotion, color: "text-muted", w: "w-3/4" },
  { icon: FaFigma, color: "text-accent", w: "w-3/5" },
];

export const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-fg">
      {/* ── Sticky nav ── */}
      <header className="glass sticky top-0 z-50 border-b border-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" aria-label="Cluttr home" className="shrink-0">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/signin"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
            >
              Get started
              <HiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="aurora-glow" aria-hidden="true" />
          <div className="ambient" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mx-auto max-w-3xl text-center"
            >
              <motion.span
                variants={fadeUp}
                transition={{ duration: 0.5, ease }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted"
              >
                <HiSparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Your AI-powered second brain
              </motion.span>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.5, ease }}
                className="mt-6 text-4xl font-bold tracking-tight md:text-6xl"
              >
                Save anything.
                <br className="hidden sm:block" /> Find{" "}
                <span className="gradient-text">everything</span>.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5, ease }}
                className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
              >
                Cluttr is the second brain for every link you love. Drop in a
                video, tweet, repo or article — it auto-organizes, renders rich
                previews, and lets you search or chat with your knowledge.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.5, ease }}
                className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover sm:w-auto"
                >
                  Start for free
                  <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-border-strong px-6 py-3 text-sm font-semibold text-fg transition-colors hover:bg-surface-2 sm:w-auto"
                >
                  Sign in
                </Link>
              </motion.div>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5, ease }}
                className="mt-5 flex items-center justify-center gap-2 text-xs text-subtle"
              >
                <HiCheck className="h-4 w-4 text-success" aria-hidden="true" />
                No credit card · Free forever core
              </motion.p>
            </motion.div>

            {/* ── Product preview mock ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.25 }}
              className="mx-auto mt-16 max-w-5xl"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-pop"
              >
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-danger/70" />
                  <span className="h-3 w-3 rounded-full bg-warning/70" />
                  <span className="h-3 w-3 rounded-full bg-success/70" />
                  <div className="ml-4 flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-subtle">
                    <LuSearch className="h-3.5 w-3.5" aria-hidden="true" />
                    Search your brain…
                  </div>
                </div>

                <div className="flex">
                  {/* Faux sidebar */}
                  <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r border-border bg-canvas-subtle p-4 sm:flex">
                    <div className="mb-3 flex items-center gap-2 px-1">
                      <LogoMark size={18} />
                      <span className="text-sm font-semibold text-fg">
                        Cluttr
                      </span>
                    </div>
                    {[
                      { icon: LuBrain, label: "All", active: true },
                      { icon: LuStar, label: "Favorites", active: false },
                      { icon: LuTags, label: "Tags", active: false },
                      { icon: LuFolders, label: "Collections", active: false },
                      { icon: LuShare2, label: "Shared", active: false },
                    ].map(({ icon: Icon, label, active }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                          active
                            ? "bg-accent-soft font-medium text-accent"
                            : "text-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </div>
                    ))}
                  </aside>

                  {/* Faux content grid */}
                  <div className="grid flex-1 grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5">
                    {MOCK_TILES.map(({ icon: Icon, color, w }, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-surface-2 p-3.5"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <Icon
                            className={`h-5 w-5 ${color}`}
                            aria-hidden="true"
                          />
                          <span className="h-2 w-2 rounded-full bg-accent" />
                        </div>
                        <div className="space-y-2">
                          <div className={`h-2.5 rounded-full bg-elevated ${w}`} />
                          <div className="h-2.5 w-full rounded-full bg-elevated/70" />
                          <div className="h-2.5 w-1/3 rounded-full bg-elevated/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Logo cloud ── */}
        <section
          aria-label="Supported platforms"
          className="border-y border-border bg-canvas-subtle"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-subtle">
              Capture from anywhere
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
              {PLATFORMS.map(({ icon: Icon, label }) => (
                <Icon
                  key={label}
                  role="img"
                  aria-label={label}
                  className="h-7 w-7 text-subtle transition-colors hover:text-muted sm:h-8 sm:w-8"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Features grid ── */}
        <section
          aria-labelledby="features-heading"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="features-heading"
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              Everything your brain needs, in one place
            </h2>
            <p className="mt-4 text-muted">
              Powerful, AI-native tools that turn a pile of links into knowledge
              you can actually use.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                transition={{ duration: 0.45, ease }}
                className="card-hover rounded-2xl border border-border bg-surface p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── How it works ── */}
        <section
          aria-labelledby="how-heading"
          className="border-t border-border bg-canvas-subtle"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="how-heading"
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                From cluttered tabs to clarity in seconds
              </h2>
              <p className="mt-4 text-muted">
                Three steps. No setup. Your second brain builds itself.
              </p>
            </div>

            <motion.ol
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {STEPS.map(({ title, desc }, i) => (
                <motion.li
                  key={title}
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease }}
                  className="relative rounded-2xl border border-border bg-surface p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-fg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {desc}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ── Closing CTA band ── */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden rounded-3xl border border-border bg-accent-soft px-6 py-16 text-center sm:px-12"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-fg">
              <LuBrain className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
              Your second brain, finally organized
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Stop losing brilliant links to forgotten tabs. Start building a
              brain you can search, ask and share.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover sm:w-auto"
              >
                Start for free
                <HiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex w-full items-center justify-center rounded-xl border border-border-strong bg-surface px-7 py-3 text-sm font-semibold text-fg transition-colors hover:bg-surface-2 sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted">
              Save anything. Find everything. Your second brain, finally
              organized.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
          >
            <a
              href="#features-heading"
              className="text-muted transition-colors hover:text-fg"
            >
              Features
            </a>
            <a
              href="#how-heading"
              className="text-muted transition-colors hover:text-fg"
            >
              How it works
            </a>
            <a href="#" className="text-muted transition-colors hover:text-fg">
              Privacy
            </a>
            <a href="#" className="text-muted transition-colors hover:text-fg">
              Contact
            </a>
          </nav>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-subtle sm:px-6">
            © 2026 Cluttr
          </p>
        </div>
      </footer>
    </div>
  );
};
