import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Groovly — Collaborative Music for Every Gathering",
  description: "Groovly lets every guest add, vote, and vibe. Build collaborative playlists for any party, trip, or hangout.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-bg text-white font-sans min-h-screen flex items-stretch">
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
