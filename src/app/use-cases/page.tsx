import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const evidenceTypes = [
  {
    title: "Profile text and captions",
    description: "Submit text you are authorized to share. TrueSight can report literal details, such as hashtags in caption evidence, with a link to the submitted source.",
    icon: FileText,
  },
  {
    title: "Professional information",
    description: "Submit experience, education, skills, or certification claims. The report can describe what the material says; it does not verify credentials with issuers.",
    icon: Briefcase,
  },
  {
    title: "Optional image evidence",
    description: "Attach an image when it helps explain the material. Image analysis is skipped unless a configured image-capable provider is enabled and you explicitly consent.",
    icon: ImageIcon,
  },
];

export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">Current review scope</p>
        <h1 className="mt-3 text-4xl font-bold text-purple-950">Review material you provide</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-800">
          TrueSight currently reviews user-submitted material for Instagram or LinkedIn profiles. It does not fetch profile pages, confirm identity, determine whether someone is safe, or produce a risk score.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {evidenceTypes.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
              <Icon className="h-7 w-7 text-purple-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-purple-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-purple-800">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-sm leading-6 text-blue-950">
          Reports describe only the material supplied for that request. Automated collection and external model analysis are unavailable unless an authorized provider is configured; external AI processing also requires your opt-in.
        </div>

        <Button asChild className="mt-8 bg-purple-700 text-white hover:bg-purple-800">
          <Link href="/scan">Start an evidence review <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>
    </main>
  );
}
