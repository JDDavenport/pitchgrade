"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, CreditCard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.push("/sign-in");
  }, [session, isPending, router]);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout failed");
    } catch { alert("Checkout failed"); }
    finally { setCheckingOut(false); }
  }

  if (isPending) return <div className="min-h-screen flex items-center justify-center"><div className="text-zinc-500">Loading...</div></div>;
  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {session.user.name || "there"}!</h1>
          <p className="text-zinc-400">{session.user.email}</p>
        </div>
        <button onClick={() => signOut().then(() => router.push("/"))}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 card-glow">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-indigo-400" />
            <h2 className="text-xl font-semibold">Analyze a Pitch Deck</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-4">
            Upload your pitch deck PDF and get scored on 12 VC criteria with actionable feedback.
          </p>
          <Link href="/upload"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Upload Deck <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 card-glow">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-8 w-8 text-green-400" />
            <h2 className="text-xl font-semibold">Subscription</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-4">
            Subscribe for $9/month to unlock 50 pitch deck analyses per month.
          </p>
          <button onClick={handleCheckout} disabled={checkingOut}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {checkingOut ? "Loading..." : "Subscribe — $9/mo"}
          </button>
        </div>
      </div>
    </div>
  );
}
