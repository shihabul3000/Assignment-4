import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import TutorProfileClient from "./TutorProfileClient";

export const metadata: Metadata = {
    title: "Tutor Profile | SkillBridge",
    description: "View tutor profile and book a session",
};

// Generate static params for dynamic routes - required for static export
export async function generateStaticParams() {
    // Return empty array - this page will be dynamically rendered at runtime
    // with client-side data fetching
    return [];
}

export default function TutorProfilePage() {
    return (
        <Suspense fallback={
            <div className="container px-4 py-20 text-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" />
                <p className="mt-4 text-slate-500">Loading tutor profile...</p>
            </div>
        }>
            <TutorProfileClient />
        </Suspense>
    );
}
