"use client";

import { useState } from "react";
import { summarizeContent } from "@/lib/api";
import { saveNote } from "@/lib/supabase";

const MAX_CHARS = 4000;

export default function NoteSummarizer() {
    const [title, setTitle] = useState("");
    const [original, setOriginal] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function validateInput() {
        if (!original.trim()) {
            setError("Paste some notes to summarize.");
            return false;
        }
        if (original.length > MAX_CHARS) {
            setError(`Notes must be under ${MAX_CHARS} characters.`);
            return false;
        }
        return true;
    }

    async function handleSummarize() {
        setError("");
        setSuccess("");

        if (!validateInput()) return;

        setLoading(true);
        try {
            const result = await summarizeContent(title, original);
            setSummary(result.summary);
        } catch {
            setError("Something went wrong while summarizing.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setError("");
        setSuccess("");

        if (!title.trim()) {
            setError("Add a title before saving.");
            return;
        }

        try {
            await saveNote(title, original, summary);
            setTitle("");
            setOriginal("");
            setSummary("");
            setSuccess("✅ Summary stored in your notebook.");
        } catch {
            setError("Failed to save note.");
        }
    }

    return (
        <div className="min-h-screen bg-[#050507] text-zinc-100">
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                {/* Header */}
                <header className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                        Notes · Utility
                    </p>
                    <h1 className="text-3xl font-medium text-zinc-50">
                        AI Notes Summarizer
                    </h1>
                    <p className="text-sm text-zinc-500 max-w-md">
                        Turn messy notes into clean, structured summaries without leaving your workspace.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT: INPUT */}
                    <div className="space-y-4">
                        <div className="rounded-2xl bg-[#08080b] border border-zinc-900 px-5 py-4 space-y-3">
                            <p className="text-xs font-medium text-zinc-500">
                                1 · Title
                            </p>

                            <input
                                type="text"
                                placeholder="Notes Title - Aviation 101"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent border border-zinc-900 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-zinc-500"
                            />
                        </div>

                        <div className="rounded-2xl bg-[#08080b] border border-zinc-900 px-5 py-4 space-y-3">
                            <p className="text-xs font-medium text-zinc-500">
                                2 · Notes
                            </p>

                            <textarea
                                placeholder="Drop your raw notes here…"
                                value={original}
                                onChange={(e) =>
                                    setOriginal(e.target.value.slice(0, MAX_CHARS))
                                }
                                rows={10}
                                className="w-full bg-transparent border border-zinc-900 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-zinc-500"
                            />

                            <div className="flex items-center justify-between text-[11px] text-zinc-600">
                                <span>Character limit</span>
                                <span>
                  {original.length} / {MAX_CHARS}
                </span>
                            </div>

                            <button
                                onClick={handleSummarize}
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center rounded-xl bg-zinc-100 text-[13px] font-medium text-zinc-900 py-2.5 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Summarizing…" : "Generate summary"}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: OUTPUT */}
                    <div className="space-y-4">
                        <div className="rounded-2xl bg-[#08080b] border border-zinc-900 px-5 py-4 min-h-[260px]">
                            <p className="text-xs font-medium text-zinc-500 mb-2">
                                3 · Summary
                            </p>

                            {summary ? (
                                <p className="text-sm leading-relaxed text-zinc-100 whitespace-pre-wrap">
                                    {summary}
                                </p>
                            ) : (
                                <p className="text-sm text-zinc-500">
                                    Your summary will appear here. Keep the input focused for better output.
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!summary}
                            className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500/90 text-[13px] font-medium text-emerald-50 py-2.5 hover:bg-emerald-400/95 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Save note
                        </button>

                        {error && (
                            <div className="rounded-xl border border-red-900/70 bg-red-950/60 px-3 py-2 text-xs text-red-200">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-xl border border-emerald-900/70 bg-emerald-950/60 px-3 py-2 text-xs text-emerald-200">
                                {success}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
