import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PitchGrade — AI Pitch Deck Analyzer",
  description: "Upload your pitch deck. Get scored on 12 VC criteria with actionable feedback in seconds.",
  openGraph: {
    title: "PitchGrade — AI Pitch Deck Analyzer",
    description: "Get your pitch deck scored on 12 VC criteria instantly.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-zinc-950 text-zinc-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
