import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Notes Summarizer",
    description:
        "Summarize long notes instantly with GPT-powered AI and save them for later.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="antialiased bg-white text-gray-900">
        {children}
        </body>
        </html>
    );
}
