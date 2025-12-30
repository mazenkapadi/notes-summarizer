# AI Notes Summarizer

AI Notes Summarizer is a small Next.js application that turns messy study notes into clean, compact summaries using the
OpenAI API, then stores both the original and the summary in a Supabase-backed Postgres database.

## Features

- Paste raw notes and generate a concise 2–3 sentence or bullet-point summary via an `/api/summarize` route using
  OpenAI's Chat Completions API.
- Save the original content and generated summary to a `notes` table in Supabase directly from the client using the anon
  key.
- Clean, minimal UI built with the Next.js App Router (`app/` directory), including a character counter, inline
  validation, and success/error feedback.

## Tech Stack

- Next.js App Router with TypeScript and React client components.
- OpenAI JavaScript SDK for calling `gpt-4.1-nano` from a route handler.
- Supabase JavaScript client for inserting notes into a Postgres table.

## Getting Started

### Prerequisites

- Node.js and a package manager (npm, yarn, pnpm, or bun)
- An OpenAI API key
- A Supabase project (URL and anon key)

### Installation

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### Development

1. Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open `http://localhost:3000` in your browser.

## Supabase Schema

Create a `notes` table in Supabase with at least the following columns:

```sql
CREATE TABLE public.notes
(
    id               bigint generated always as identity primary key,
    title            text not null,
    original_content text not null,
    summary          text not null,
    user_id          uuid,
    created_at       timestamptz default now()
);
```

If Row Level Security (RLS) is enabled, add a policy to allow anonymous inserts:

```sql
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Allow anon insert notes"
ON public.notes
FOR INSERT
TO anon
USING (true)
WITH CHECK (true);
```

## Project Structure

- `app/api/summarize/route.ts` – Route handler that calls OpenAI to clean up and summarize notes.
- `app/page.tsx` – Main UI with the note editor, summary display, and save button.
- `lib/api.ts` – Client helper for calling the `/api/summarize` endpoint.
- `lib/supabase.ts` – Supabase client and `saveNote` helper for inserting into the `notes` table.

## Deployment

Deploy the app to Vercel or your preferred platform. Make sure to configure the `OPENAI_API_KEY`,
`NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in your hosting provider's
dashboard.