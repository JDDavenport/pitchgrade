"use client";

import Link from "next/link";
import { Check, ArrowRight, BarChart3 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="hero-gradient">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          <span className="gradient-text">PitchGrade</span>
        </Link>
        <Link href="/sign-in" className="text-sm px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
          Sign In
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-zinc-400 text-lg">One plan. Everything you need to perfect your pitch.</p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="bg-zinc-900/50 border-2 border-indigo-500 rounded-2xl p-8 relative card-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Pro Plan
            </div>
            <div className="text-center mb-6">
              <p className="text-5xl font-bold">$9<span className="text-lg font-normal text-zinc-400">/month</span></p>
              <p className="text-zinc-400 text-sm mt-2">Cancel anytime</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "50 pitch deck analyses per month",
                "12-criteria VC scoring",
                "Actionable improvement suggestions",
                "Investor verdict assessment",
                "Letter grade + overall score",
                "Priority processing",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up"
              className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors">
              Get Started <ArrowRight className="h-4 w-4 inline ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
