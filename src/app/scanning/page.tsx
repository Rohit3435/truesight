import Link from "next/link";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

/** The former timer-driven scan screen has no backend job to track. */
export default function ScanningPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-white to-pink-100 px-4 py-16">
      <section className="max-w-xl rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-lg">
        <FileSearch className="mx-auto mb-4 h-10 w-10 text-purple-600" />
        <h1 className="text-2xl font-bold text-purple-950">No analysis is running</h1>
        <p className="mt-3 text-purple-700">Submit evidence from the review form to start an analysis. Progress is shown only after the request reaches the analysis endpoint.</p>
        <Button asChild className="mt-6 bg-purple-700 text-white hover:bg-purple-800">
          <Link href="/scan"><ArrowLeft className="mr-2 h-4 w-4" /> Go to evidence review</Link>
        </Button>
      </section>
    </main>
  );
}
