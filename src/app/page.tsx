"use client"

import Link from "next/link"
import { ArrowRight, FileText, Zap, BarChart3, Star } from "lucide-react"
import { motion } from "framer-motion"
import { CRITERIA } from "@/lib/utils"

function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Pitch<span className="gradient-text">Grade</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition">Pricing</Link>
          <Link
            href="/upload"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition"
          >
            Grade My Pitch
          </Link>
        </div>
      </div>
    </nav>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Home() {
  return (
    <>
      <Nav />
      <main className="hero-gradient">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 mb-8">
                <Zap className="w-3 h-3 text-indigo-400" />
                AI-powered pitch deck analysis in 30 seconds
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Know your pitch score{" "}
              <span className="gradient-text">before VCs do</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Upload your pitch deck PDF. Get scored on 12 real VC evaluation criteria
              with actionable feedback — in seconds, not weeks.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/upload"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-indigo-600/20"
              >
                Grade My Pitch <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-8 py-4 rounded-xl font-semibold text-lg transition"
              >
                View Pricing
              </Link>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-zinc-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Free tier: 1 deck per day. No signup required.
            </motion.p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: FileText, title: "Upload PDF", desc: "Drag and drop your pitch deck. We support any PDF format." },
                { icon: Zap, title: "AI Analysis", desc: "Our AI evaluates your deck across 12 VC scoring criteria in ~30 seconds." },
                { icon: BarChart3, title: "Get Your Score", desc: "Receive a detailed scorecard with letter grade and actionable feedback." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 mb-4">
                    <step.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-sm text-indigo-400 font-medium mb-2">Step {i + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 12 Criteria */}
        <section className="py-20 px-6 border-t border-zinc-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">12 VC Scoring Criteria</h2>
            <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
              The same framework top investors use to evaluate pitch decks — now accessible to everyone.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CRITERIA.map((c, i) => (
                <motion.div
                  key={c.id}
                  className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm">{c.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{c.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-20 px-6 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium mb-4 text-balance">
              &ldquo;Got more useful feedback in 30 seconds than I did from 3 advisor meetings.&rdquo;
            </blockquote>
            <p className="text-zinc-500">— MBA Founder, Y Combinator W25 applicant</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-zinc-900">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to improve your pitch?</h2>
            <p className="text-zinc-400 mb-8">Upload your deck now. Get your score in 30 seconds.</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-indigo-600/20"
            >
              Grade My Pitch — Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-8 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-500">
            <span>© 2026 PitchGrade</span>
            <div className="flex gap-6">
              <Link href="/pricing" className="hover:text-zinc-300 transition">Pricing</Link>
              <Link href="/upload" className="hover:text-zinc-300 transition">Upload</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
