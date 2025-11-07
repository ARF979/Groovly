import Link from "next/link";
import { CD } from "@/components/CD";
import { StarField } from "@/components/StarField";

const cdData = [
  { src: "/assets/cd1.jpg", alt: "Groovify your night" },
  { src: "/assets/cd2.jpg", alt: "Dance with your F.R.I.E.N.D.S" },
  { src: "/assets/cd3.jpg", alt: "Trip Mode" },
  { src: "/assets/cd1.jpg", alt: "Party Vibes" },
  { src: "/assets/cd2.jpg", alt: "Collaborative Beats" },
];

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#1B2735_0%,#090A0F_100%)]">
      {/* Parallax Star Field Background */}
      <StarField />
      
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 lg:px-16">
          <div className="text-lg font-semibold text-white">Groovly</div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/30"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-purple-600 hover:to-pink-600"
            >
              Sign Up
            </Link>
          </div>
        </nav>
        
        <header className="mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-20 pt-12 md:px-10 lg:px-16">
          <div className="flex flex-col items-center gap-10 text-center">
            {/* Main heading */}
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
              <span className="font-imperial">Groovly</span> <span className="font-display whitespace-nowrap">is the new</span>
              <br />
              <span className="font-display bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent whitespace-nowrap">standard for collaboration</span>
            </h1>
          </div>
          
          {/* Scattered CD Layout */}
          <section className="relative min-h-[2000px] w-full pt-20" id="features">
            {/* CD 1 - Far Left Top */}
            <div 
              className="absolute left-0 top-[100px] opacity-0 translate-y-12 transition-all duration-1000 ease-out [animation:fadeInUp_0.8s_ease-out_0.1s_forwards]"
            >
              <CD src={cdData[0].src} side="left" alt={cdData[0].alt} />
            </div>

            {/* CD 2 - Far Right Top */}
            <div 
              className="absolute right-0 top-[50px] opacity-0 translate-y-12 transition-all duration-1000 ease-out [animation:fadeInUp_0.8s_ease-out_0.3s_forwards]"
            >
              <CD src={cdData[1].src} side="right" alt={cdData[1].alt} />
            </div>

            {/* CD 3 - Center Middle */}
            <div 
              className="absolute left-1/2 top-[450px] -translate-x-1/2 opacity-0 translate-y-12 transition-all duration-1000 ease-out [animation:fadeInUp_0.8s_ease-out_0.5s_forwards]"
            >
              <CD src={cdData[2].src} side="right" alt={cdData[2].alt} />
            </div>

            {/* Decorative Text 1 */}
            <div 
              className="absolute left-[5%] top-[750px] max-w-xs opacity-0 [animation:fadeIn_0.8s_ease-out_0.7s_forwards]"
            >
              <svg className="absolute -left-12 -top-8 h-24 w-24 text-white/40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50 Q 40 20, 80 30" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)"/>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
              <p className="font-handwriting text-xl text-white/80 italic" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                Your queue of songs, your choices
              </p>
            </div>

            {/* CD 4 - Left Lower */}
            <div 
              className="absolute left-0 top-[1000px] opacity-0 translate-y-12 transition-all duration-1000 ease-out [animation:fadeInUp_0.8s_ease-out_0.9s_forwards]"
            >
              <CD src={cdData[3].src} side="left" alt={cdData[3].alt} />
            </div>

            {/* CD 5 - Right Lower */}
            <div 
              className="absolute right-0 top-[1350px] opacity-0 translate-y-12 transition-all duration-1000 ease-out [animation:fadeInUp_0.8s_ease-out_1.1s_forwards]"
            >
              <CD src={cdData[4].src} side="right" alt={cdData[4].alt} />
            </div>

            {/* Decorative Text 2 */}
            <div 
              className="absolute right-[8%] top-[1650px] max-w-xs text-right opacity-0 [animation:fadeIn_0.8s_ease-out_1.3s_forwards]"
            >
              <svg className="absolute -right-12 -top-6 h-20 w-20 rotate-12 text-white/40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M80 50 Q 60 20, 20 30" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead2)"/>
                <defs>
                  <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
              <p className="font-handwriting text-xl text-white/80 italic" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                Every beat, every vote matters
              </p>
            </div>
          </section>
        </header>
        
        <section
          id="what-is-groovly"
          className="relative mx-auto mt-32 max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-b from-surface/80 to-card/60 px-8 py-20 backdrop-blur-xl sm:px-12 lg:px-20"
        >
          <div className="absolute inset-x-12 -top-8 h-32 rounded-full bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-14 text-center">
            <header className="flex flex-col gap-5">
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                What does Groovly do?
              </h2>
              <p className="text-xl leading-relaxed text-muted">
                Turn any gathering into a collaborative concert.
              </p>
            </header>
            
            <div className="grid gap-8 text-left md:grid-cols-3 md:text-center">
              <div className="group rounded-2xl border border-white/10 bg-surface/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/30 hover:bg-surface/60 hover:shadow-xl hover:shadow-purple-500/10">
                <h3 className="font-display text-2xl font-semibold text-white">Live DJ Queue</h3>
                <p className="mt-4 text-muted leading-relaxed">
                  Crowd votes on the next track so the energy never dips.
                </p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-surface/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-400/30 hover:bg-surface/60 hover:shadow-xl hover:shadow-pink-500/10">
                <h3 className="font-display text-2xl font-semibold text-white">Mini Games</h3>
                <p className="mt-4 text-muted leading-relaxed">
                  Guess-the-song and DJ battles keep guests engaged between tracks.
                </p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-surface/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/30 hover:bg-surface/60 hover:shadow-xl hover:shadow-orange-500/10">
                <h3 className="font-display text-2xl font-semibold text-white">Session Recap</h3>
                <p className="mt-4 text-muted leading-relaxed">
                  Export the playlist and relive the night, wherever the party moves next.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-8 py-3.5 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
        
        <footer className="mx-auto mt-32 max-w-6xl px-6 pb-24 text-center text-sm text-muted/60">
          © {new Date().getFullYear()} Groovly. Crafted for unforgettable gatherings.
        </footer>
      </div>
    </main>
  );
}
