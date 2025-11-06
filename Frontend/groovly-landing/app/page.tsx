import Link from "next/link";
import { HeroDynamicText } from "@/components/HeroDynamicText";
import { AlternatingRow, type AlternatingRowProps } from "@/components/AlternatingRow";

const rows: AlternatingRowProps[] = [
  {
    cdSrc: "/assets/cd1.jpg",
    side: "left",
    title: "Groovify your night",
    body: "Let friends add tracks and vote — the crowd decides the next tune.",
  },
  {
    cdSrc: "/assets/cd2.jpg",
    side: "right",
    title: "Dance with your F.R.I.E.N.D.S",
    body: "Instant party-ready playlists. No fuss, only vibes.",
  },
  {
    cdSrc: "/assets/cd3.jpg",
    side: "left",
    title: "Trip Mode",
    body: "Road trip soundtrack made by passengers — offline-capable and fun.",
  },
];

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,209,102,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(93,63,211,0.22),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2750%27 height=%2750%27 viewBox=%270 0 10 10%27%3E%3Cg fill=%27%231f1f23%27 fill-opacity=%270.6%27%3E%3Cpath d=%27M0 0h10v10H0z%27/%3E%3C/g%3E%3C/svg%3E')" }} />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-24 md:px-10 lg:px-16">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm uppercase tracking-[0.3em] text-muted">
              Collaborative music for every vibe
            </div>
            <h1 className="font-display text-5xl font-black tracking-tight text-white drop-shadow-sm md:text-7xl lg:text-8xl">
              GROOVLY
            </h1>
            <HeroDynamicText />
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-muted md:text-xl">
              Create instant party rooms where every guest can add, vote and enjoy together.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 font-semibold text-black shadow-glow transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Create a party
              </Link>
              <Link
                href="#what-is-groovly"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 font-semibold text-white/90 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Watch demo
              </Link>
            </div>
          </div>
          <section className="flex flex-col gap-20" id="features">
            {rows.map((row) => (
              <AlternatingRow
                key={row.title}
                cdSrc={row.cdSrc}
                side={row.side}
                title={row.title}
                body={row.body}
              />
            ))}
          </section>
        </header>
        <section
          id="what-is-groovly"
          className="relative mx-auto mt-24 max-w-6xl rounded-3xl border border-white/10 bg-card/70 px-8 py-16 backdrop-blur sm:px-12 lg:px-20"
        >
          <div className="absolute inset-x-12 -top-6 h-24 rounded-full bg-gradient-to-b from-accent/20 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-12 text-center">
            <header className="flex flex-col gap-4">
              <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">
                What does Groovly do?
              </h2>
              <p className="text-lg leading-relaxed text-muted md:text-xl">
                Turn any gathering into a collaborative concert.
              </p>
            </header>
            <div className="grid gap-10 text-left md:grid-cols-3 md:text-center">
              <div className="rounded-2xl border border-white/10 bg-surface/70 p-6 shadow-inner transition-transform duration-200 hover:-translate-y-2">
                <h3 className="font-display text-2xl text-white">Live DJ Queue</h3>
                <p className="mt-3 text-muted">
                  Crowd votes on the next track so the energy never dips.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-surface/70 p-6 shadow-inner transition-transform duration-200 hover:-translate-y-2">
                <h3 className="font-display text-2xl text-white">Mini Games</h3>
                <p className="mt-3 text-muted">
                  Guess-the-song and DJ battles keep guests engaged between tracks.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-surface/70 p-6 shadow-inner transition-transform duration-200 hover:-translate-y-2">
                <h3 className="font-display text-2xl text-white">Session Recap</h3>
                <p className="mt-3 text-muted">
                  Export the playlist and relive the night, wherever the party moves next.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 font-semibold text-black shadow-glow transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Create a party
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 font-semibold text-white/90 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Watch demo
              </Link>
            </div>
          </div>
        </section>
        <footer className="mx-auto mt-24 max-w-6xl px-6 pb-20 text-center text-sm text-muted">
          © {new Date().getFullYear()} Groovly. Crafted for unforgettable gatherings.
        </footer>
      </div>
    </main>
  );
}
