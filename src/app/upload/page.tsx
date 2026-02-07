"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, FileText, Loader2, X, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File must be under 20MB")
      return
    }
    setError("")
    setFile(f)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleSubmit = async () => {
    if (!file) return
    setUploading(true)
    setError("")
    setProgress("Extracting text from PDF...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      setProgress("Analyzing with AI across 12 criteria...")

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Analysis failed")
      }

      const data = await res.json()
      // Store result in sessionStorage and navigate
      sessionStorage.setItem("pitchgrade_result", JSON.stringify(data))
      router.push("/results")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen hero-gradient">
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Pitch<span className="gradient-text">Grade</span>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.h1
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Upload your pitch deck
        </motion.h1>
        <motion.p
          className="text-zinc-400 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          PDF format, up to 20MB. We&apos;ll analyze it across 12 VC criteria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
              dragging
                ? "border-indigo-500 bg-indigo-500/5"
                : file
                ? "border-zinc-700 bg-zinc-900/50"
                : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null) }}
                      className="ml-4 p-2 hover:bg-zinc-800 rounded-lg transition"
                    >
                      <X className="w-4 h-4 text-zinc-500" />
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Upload className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                  <p className="font-medium mb-1">Drop your pitch deck here</p>
                  <p className="text-sm text-zinc-500">or click to browse</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className={cn(
              "w-full mt-6 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3",
              file && !uploading
                ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            )}
            whileTap={file && !uploading ? { scale: 0.98 } : {}}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress}
              </>
            ) : (
              "Analyze My Pitch Deck"
            )}
          </motion.button>

          {uploading && (
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: "5%" }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 25, ease: "linear" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Extracting text", "Scoring criteria", "Generating feedback"].map((s, i) => (
                  <div key={s} className="text-xs text-zinc-500 text-center">
                    <div className={cn(
                      "w-2 h-2 rounded-full mx-auto mb-1",
                      i === 0 ? "bg-emerald-400" : i === 1 ? "bg-indigo-400 animate-pulse" : "bg-zinc-700"
                    )} />
                    {s}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
