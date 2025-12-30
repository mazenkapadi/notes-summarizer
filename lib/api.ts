export async function summarizeContent(title: string, content: string) {
    const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to summarize');
    }

    return response.json();
}