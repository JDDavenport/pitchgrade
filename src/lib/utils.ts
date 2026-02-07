import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLetterGrade(score: number): string {
  if (score >= 9) return "A+"
  if (score >= 8.5) return "A"
  if (score >= 8) return "A-"
  if (score >= 7.5) return "B+"
  if (score >= 7) return "B"
  if (score >= 6.5) return "B-"
  if (score >= 6) return "C+"
  if (score >= 5.5) return "C"
  if (score >= 5) return "C-"
  if (score >= 4) return "D"
  return "F"
}

export function getGradeColor(score: number): string {
  if (score >= 8) return "text-emerald-400"
  if (score >= 6) return "text-yellow-400"
  if (score >= 4) return "text-orange-400"
  return "text-red-400"
}

export function getGradeBg(score: number): string {
  if (score >= 8) return "bg-emerald-400/10 border-emerald-400/20"
  if (score >= 6) return "bg-yellow-400/10 border-yellow-400/20"
  if (score >= 4) return "bg-orange-400/10 border-orange-400/20"
  return "bg-red-400/10 border-red-400/20"
}

export const CRITERIA = [
  { id: "problem_clarity", name: "Problem Clarity", desc: "Is the pain real and well-articulated?" },
  { id: "market_size", name: "Market Size", desc: "TAM/SAM/SOM analysis" },
  { id: "solution_uniqueness", name: "Solution Uniqueness", desc: "How differentiated is the solution?" },
  { id: "business_model", name: "Business Model", desc: "Revenue model clarity" },
  { id: "traction", name: "Traction & Metrics", desc: "Evidence of product-market fit" },
  { id: "team", name: "Team Credibility", desc: "Founder-market fit and experience" },
  { id: "moat", name: "Competitive Moat", desc: "Defensibility and barriers to entry" },
  { id: "gtm", name: "Go-to-Market", desc: "Customer acquisition strategy" },
  { id: "financials", name: "Financial Projections", desc: "Realism of financial model" },
  { id: "ask", name: "Ask Clarity", desc: "How much capital, for what milestones" },
  { id: "design", name: "Slide Design", desc: "Visual quality and professionalism" },
  { id: "narrative", name: "Story & Narrative", desc: "Compelling storyline and flow" },
] as const

export type CriterionScore = {
  id: string
  name: string
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

export type PitchGradeResult = {
  overallScore: number
  letterGrade: string
  summary: string
  criteria: CriterionScore[]
  topStrength: string
  topWeakness: string
  investorVerdict: string
}
