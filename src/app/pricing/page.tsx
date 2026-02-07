"use client"

import Link from "next/link"
import { ArrowLeft, Check, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Try it out. No signup needed.",
    features: [
      "1 pitch deck per day",
      "12 criteria scoring",
      "Letter grade & summary",
      "Basic feedback per criterion",
    ],
    cta: "Start Free",
    href: "/upload",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For serious founders iterating fast.",
    features: [
      "Unlimited pitch decks",
      "12 criteria deep analysis",
      "Detailed strengths & improvements",
      "Investor verdict & recommendations",
      "PDF export of scorecard",
      "Priority AI processing",
      "Compare deck versions",
    ],
    cta: "Get Pro",
    href: "/upload",
    highlight: true,
  },
  {
    name: "One-Time",
    price: "$9",
    period: "per analysis",
    desc: "Just need one thorough review.",
    features: [
      "Single deep analysis",
      "12 criteria scoring",
      "Detailed feedback & improvements",
      "PDF export included",
      "No subscription required",
    ],
    cta: "Buy Single Analysis",
    href: "/upload",
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen hero-gradient">
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Pitch<span className="gradient-text">Grade</span>
          </Link>
          <Link href="/upload" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition">
            Grade My Pitch
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-zinc-400">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-6 border transition-all",
                plan.highlight
                  ? "border-indigo-500/50 bg-zinc-900/80 card-glow scale-105"
                  : "border-zinc-800 bg-zinc-900/50"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-zinc-500 mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-zinc-500 text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={cn(
                  "block w-full text-center py-3 rounded-xl font-semibold transition",
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
