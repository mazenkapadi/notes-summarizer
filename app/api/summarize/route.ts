import OpenAI from "openai";
import {NextRequest, NextResponse} from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const {title, content} = await req.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                {error: "Content is required"},
                {status: 400}
            );
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            // model: "gpt-5",
            messages: [
                {
                    role: "user",
                    content: `You are an assistant that cleans up and summarizes messy notes for study purposes.
                    
                    Instructions:
                    - Do NOT create a story or narrative; keep it factual and note-like
                    - Condense the notes into 2–3 concise sentences or bullet points
                    - Fix grammar, spelling, and punctuation
                    - Keep all technical details, numbers, and procedures intact
                    - Remove only filler words, repetition, and informal exclamations
                    - The summary should be usable as a study guide or quick reference
                    
                    Notes Title: ${title}
                    Notes Content: ${content}`
                },
            ],
        });

        const summary =
            completion.choices[0]?.message?.content ?? "";

        return NextResponse.json({
            summary,
            tokensUsed: completion.usage?.total_tokens ?? 0,
        });
    } catch (error) {
        console.error("Summarize error:", error);
        return NextResponse.json(
            {error: "Failed to summarize"},
            {status: 500}
        );
    }
}