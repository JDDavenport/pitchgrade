"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Trophy, AlertTriangle, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { cn, getLetterGrade, getGradeColor, getGradeBg, type PitchGradeResult } from "@/lib/utils"

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#27272a" strokeWidth={8} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={score >= 8 ? "#34d399" : score >= 6 ? "#facc15" : score >= 4 ? "#fb923c" : "#f87171"}
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("text-4xl font-bold", getGradeColor(score))}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          {getLetterGrade(score)}
        </motion.span>
        <motion.span
          className="text-sm text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {score.toFixed(1)}/10
        </motion.span>
      </div>
    </div>
  )
}

function CriterionCard({ criterion, index }: { criterion: any; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className={cn("border rounded-xl p-4 cursor-pointer transition-all", getGradeBg(criterion.score))}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{criterion.name}</h3>
        <span className={cn("font-bold text-lg", getGradeColor(criterion.score))}>
          {criterion.score}/10
        </span>
      </div>
      {/* Score bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
        <motion.div
          className={cn("h-full rounded-full", criterion.score >= 8 ? "bg-emerald-400" : criterion.score >= 6 ? "bg-yellow-400" : criterion.score >= 4 ? "bg-orange-400" : "bg-red-400")}
          initial={{ width: 0 }}
          animate={{ width: `${criterion.score * 10}%` }}
          transition={{ duration: 0.8, delay: 0.1 * index }}
        />
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{criterion.feedback}</p>
      {expanded && (
        <motion.div
          className="mt-3 space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {criterion.strengths?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-400 mb-1">Strengths</p>
              <ul className="text-xs text-zinc-400 space-y-1">
                {criterion.strengths.map((s: string, i: number) => <li key={i}>✓ {s}</li>)}
              </ul>
            </div>
          )}
          {criterion.improvements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-yellow-400 mb-1">To Improve</p>
              <ul className="text-xs text-zinc-400 space-y-1">
                {criterion.improvements.map((s: string, i: number) => <li key={i}>→ {s}</li>)}
              </ul>
            </div>
          )}
        </motion.div>
      )}
      <p className="text-xs text-zinc-600 mt-2">Click to {expanded ? "collapse" : "expand"}</p>
    </motion.div>
  )
}

export default function ResultsPage() {
  const [result, setResult] = useState<PitchGradeResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem("pitchgrade_result")
    if (!stored) {
      router.push("/upload")
      return
    }
    setResult(JSON.parse(stored))
  }, [router])

  if (!result) return null

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Pitch<span className="gradient-text">Grade</span>
          </Link>
          <Link href="/upload" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition">
            Analyze Another
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <Link href="/upload" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8">
          <ArrowLeft className="w-4 h-4" /> Upload Another
        </Link>

        {/* Overall Score */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Your Pitch Score</h1>
          <div className="flex justify-center mb-8">
            <ScoreRing score={result.overallScore} />
          </div>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {result.summary}
          </p>
        </motion.div>

        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <motion.div
            className="p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Trophy className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-xs text-emerald-400 font-semibold mb-1">Top Strength</p>
            <p className="text-sm text-zinc-300">{result.topStrength}</p>
          </motion.div>
          <motion.div
            className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AlertTriangle className="w-5 h-5 text-yellow-400 mb-2" />
            <p className="text-xs text-yellow-400 font-semibold mb-1">Top Weakness</p>
            <p className="text-sm text-zinc-300">{result.topWeakness}</p>
          </motion.div>
          <motion.div
            className="p-4 rounded-xl bg-indigo-400/5 border border-indigo-400/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TrendingUp className="w-5 h-5 text-indigo-400 mb-2" />
            <p className="text-xs text-indigo-400 font-semibold mb-1">Investor Verdict</p>
            <p className="text-sm text-zinc-300">{result.investorVerdict}</p>
          </motion.div>
        </div>

        {/* Criteria Grid */}
        <h2 className="text-2xl font-bold mb-6">Detailed Scoring</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {result.criteria.map((c, i) => (
            <CriterionCard key={c.id} criterion={c} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-zinc-900">
          <h3 className="text-xl font-bold mb-4">Want unlimited analyses?</h3>
          <p className="text-zinc-400 mb-6">Upgrade to Pro for unlimited decks, PDF export, and priority analysis.</p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition"
          >
            View Pro Plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}
