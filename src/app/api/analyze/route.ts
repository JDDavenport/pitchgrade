import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 86400000 }) // 24h
    return true
  }
  if (entry.count >= 3) return false // 3 per day for free tier
  entry.count++
  return true
}

async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // Dynamic import for pdf-parse
  const pdfParse = (await import("pdf-parse")) as any
  const data = await (pdfParse.default || pdfParse)(Buffer.from(buffer))
  return data.text
}

const SYSTEM_PROMPT = `You are PitchGrade, an expert VC analyst who evaluates pitch decks. You've reviewed thousands of decks at top-tier firms.

Analyze the pitch deck text and score it on these 12 criteria (1-10 each):

1. Problem Clarity - Is the pain real and well-articulated?
2. Market Size - TAM/SAM/SOM analysis quality
3. Solution Uniqueness - How differentiated is the solution?
4. Business Model - Revenue model clarity
5. Traction & Metrics - Evidence of product-market fit
6. Team Credibility - Founder-market fit and experience
7. Competitive Moat - Defensibility and barriers to entry
8. Go-to-Market - Customer acquisition strategy
9. Financial Projections - Realism of financial model
10. Ask Clarity - How much capital, for what milestones
11. Slide Design - Visual quality and professionalism (infer from structure/formatting)
12. Story & Narrative - Compelling storyline and flow

Return ONLY valid JSON in this exact format:
{
  "overallScore": <number 1-10, weighted average>,
  "summary": "<2-3 sentence overall assessment>",
  "topStrength": "<single most impressive aspect>",
  "topWeakness": "<single biggest area to improve>",
  "investorVerdict": "<would a VC take a meeting? 1-2 sentences>",
  "criteria": [
    {
      "id": "<snake_case_id>",
      "name": "<criterion name>",
      "score": <number 1-10>,
      "feedback": "<2-3 sentence specific feedback>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "improvements": ["<improvement 1>", "<improvement 2>"]
    }
  ]
}

Be honest but constructive. Score fairly — most decks should land between 4-8. Only exceptional decks get 9+. Be specific with feedback, not generic.`

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Daily limit reached. Upgrade to Pro for unlimited analyses." },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    // Extract text
    const buffer = await file.arrayBuffer()
    let text: string
    try {
      text = await extractTextFromPDF(buffer)
    } catch {
      return NextResponse.json({ error: "Could not parse PDF. Please ensure it's a valid PDF file." }, { status: 400 })
    }

    if (text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from this PDF. It may be image-based — try a text-based PDF." },
        { status: 400 }
      )
    }

    // Truncate to avoid token limits
    const truncatedText = text.slice(0, 15000)

    // Analyze with AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Here is the pitch deck content:\n\n${truncatedText}` },
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 })
    }

    const result = JSON.parse(content)
    result.letterGrade = getLetterGrade(result.overallScore)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: error.message || "Analysis failed. Please try again." },
      { status: 500 }
    )
  }
}

function getLetterGrade(score: number): string {
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
