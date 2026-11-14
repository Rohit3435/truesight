"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleHelp, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvestigationReport } from "@/lib/investigation/types";

export default function ResultsPage() {
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("investigationReport");
      if (stored) {
        const candidate = JSON.parse(stored) as { report?: InvestigationReport };
        if (candidate.report?.investigationId && Array.isArray(candidate.report.findings)) {
          setReport(candidate.report);
        }
      }
    } catch {
      setReport(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!loaded) return <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" />;

  if (!report) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-20">
        <section className="mx-auto max-w-2xl rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-lg">
          <CircleHelp className="mx-auto mb-4 h-10 w-10 text-purple-500" />
          <h1 className="text-2xl font-bold text-purple-950">No completed analysis found</h1>
          <p className="mt-3 text-purple-700">Start an evidence review to see source-linked observations here.</p>
          <Button asChild className="mt-6 bg-purple-700 text-white hover:bg-purple-800">
            <Link href="/scan">Start an evidence review</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/scan" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-950">
          <ArrowLeft className="h-4 w-4" /> New evidence review
        </Link>

        <header className="mb-8 rounded-2xl border border-purple-100 bg-white/90 p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">Evidence review</p>
              <h1 className="mt-2 break-all text-3xl font-bold text-purple-950">{report.username}</h1>
              <a className="mt-2 inline-block break-all text-sm text-purple-700 underline" href={report.profileUrl} target="_blank" rel="noreferrer">
                {report.profileUrl}
              </a>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold capitalize text-purple-800">{report.platform}</span>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-purple-100 pt-5 text-sm sm:grid-cols-3">
            <div><dt className="text-purple-500">Investigation ID</dt><dd className="mt-1 break-all font-mono text-purple-900">{report.investigationId}</dd></div>
            <div><dt className="text-purple-500">Generated</dt><dd className="mt-1 text-purple-900">{formatDate(report.generatedAt)}</dd></div>
            <div><dt className="text-purple-500">Collection</dt><dd className="mt-1 capitalize text-purple-900">{report.collectionStatus.replaceAll("_", " ")} · {report.collectionMethod.replaceAll("_", " ")}</dd></div>
          </dl>
        </header>

        <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
          <div className="flex gap-3">
            <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
            <div>
              <h2 className="font-semibold text-blue-950">Collection limits</h2>
              <p className="mt-1 text-sm text-blue-900">No profile page was fetched. This report analyzes only material you submitted. Platform data collection is unavailable until an authorized source is configured.</p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-purple-950"><FileText className="h-5 w-5" /> Evidence sources</h2>
          {report.evidenceSources.length ? (
            <ul className="mt-4 divide-y divide-purple-100">
              {report.evidenceSources.map((source) => (
                <li key={source.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div><p className="font-medium capitalize text-purple-900">{source.kind.replaceAll("_", " ")}</p><p className="text-purple-600">{source.sourceLabel} · {source.source.replaceAll("_", " ")}</p></div>
                  <span className="text-xs text-purple-500">{formatDate(source.collectedAt)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-purple-700">No evidence was attached.</p>}
        </section>

        <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-purple-950">Agent execution</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {report.agents.map((agent) => (
              <article key={agent.agent} className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                <div className="flex items-center gap-2">
                  {agent.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <CircleHelp className="h-4 w-4 text-amber-600" />}
                  <h3 className="font-semibold capitalize text-purple-950">{agent.agent.replaceAll("-", " ")}</h3>
                  <span className="ml-auto text-xs capitalize text-purple-600">{agent.status}</span>
                </div>
                <p className="mt-2 text-sm text-purple-800">{agent.summary}</p>
                {agent.provider && <p className="mt-2 text-xs text-purple-600">{agent.provider} · {agent.model}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-purple-950"><ShieldAlert className="h-5 w-5" /> Evidence-linked observations</h2>
          {report.findings.length ? (
            <div className="mt-4 space-y-4">
              {report.findings.map((finding) => (
                <article key={finding.id} className="rounded-xl border border-purple-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-purple-950">{finding.title}</h3>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">Requires review · {finding.confidence} confidence</span>
                  </div>
                  <p className="mt-2 text-purple-900">{finding.observation}</p>
                  {finding.evidenceQuote && <blockquote className="mt-3 border-l-2 border-purple-400 pl-3 text-sm italic text-purple-700">“{finding.evidenceQuote}”</blockquote>}
                  {finding.modelOutput && <p className="mt-2 text-xs text-purple-600">Model output: {finding.modelOutput.label} ({finding.modelOutput.probability.toFixed(3)}) · {finding.modelOutput.model}</p>}
                  <p className="mt-3 text-xs text-purple-500">Evidence: {finding.evidenceIds.map((id) => report.evidenceSources.find((source) => source.id === id)?.kind ?? id).join(", ")} · Agent: {finding.agent}</p>
                </article>
              ))}
            </div>
          ) : <p className="mt-3 text-sm text-purple-700">No supported observations were produced from the submitted evidence.</p>}
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-950">Limitations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900">
            {report.limitations.map((limitation, index) => <li key={`${index}-${limitation}`}>{limitation}</li>)}
          </ul>
          <p className="mt-4 border-t border-amber-200 pt-4 text-xs text-amber-900">These observations describe the submitted material only. They do not verify the profile or establish facts about the person behind it.</p>
        </section>
      </div>
    </main>
  );
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Unavailable" : parsed.toLocaleString();
}
