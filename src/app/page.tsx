import Link from "next/link";
import { ArrowRight, BarChart3, Check, FileText, Sparkles, Target, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative hero-gradient">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          <span className="gradient-text">PitchGrade</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Pricing</Link>
          <Link href="/sign-in" className="text-sm px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" /> AI-Powered Pitch Deck Analysis
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Get Your Pitch Deck
          <br />
          <span className="gradient-text">VC-Ready</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Upload your pitch deck. Get scored on 12 VC criteria with actionable feedback in <span className="text-white font-semibold">seconds</span>.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-lg text-lg font-semibold transition-colors">
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/pricing"
            className="inline-flex items-center gap-2 border border-zinc-800 hover:bg-zinc-900 px-8 py-3.5 rounded-lg text-lg font-medium transition-colors">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "12 VC Criteria", desc: "Scored on problem clarity, market size, traction, team, moat, financials, and 6 more dimensions VCs actually care about." },
            { icon: TrendingUp, title: "Actionable Feedback", desc: "Not just scores — specific strengths, weaknesses, and concrete improvements for every criterion." },
            { icon: Zap, title: "Instant Results", desc: "Upload a PDF, get a full analysis in under 30 seconds. Iterate fast before your next pitch." },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 card-glow hover:border-indigo-500/30 transition-colors">
              <f.icon className="h-10 w-10 text-indigo-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            "Overall score with letter grade (A+ to F)",
            "12 detailed criterion scores (1-10 each)",
            "Top strength & top weakness highlighted",
            "Specific improvement suggestions per criterion",
            "Investor verdict: would a VC take the meeting?",
            "Narrative & storytelling assessment",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 p-3">
              <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-4 pb-20" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="max-w-sm mx-auto">
          <div className="bg-zinc-900/50 border-2 border-indigo-500 rounded-2xl p-8 relative text-center card-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Pro Plan
            </div>
            <p className="text-5xl font-bold mb-1">
              $9<span className="text-lg font-normal text-zinc-400">/month</span>
            </p>
            <p className="text-zinc-400 text-sm mb-6">50 analyses per month · Cancel anytime</p>
            <ul className="space-y-3 text-sm text-left mb-8">
              {[
                "50 pitch deck analyses per month",
                "12-criteria VC scoring",
                "Actionable improvement suggestions",
                "Investor verdict assessment",
                "Letter grade + overall score",
                "Priority processing",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-zinc-300">
                  <Check className="h-4 w-4 text-green-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up"
              className="block bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors">
              Get Started <ArrowRight className="h-4 w-4 inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Stop Guessing. Start Pitching with Confidence.</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Know exactly how VCs will evaluate your deck before you walk in the room.
          </p>
          <Link href="/sign-up"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-lg text-lg font-semibold transition-colors">
            Get Started Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="h-4 w-4" /> PitchGrade
        </div>
        <p>© 2026 PitchGrade. Built for founders.</p>
      </footer>
    </div>
  );
}
