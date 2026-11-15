"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { InvestigationReport } from "@/lib/investigation/types";

export default function HistoryPage() {
  const [items, setItems] = useState<InvestigationReport[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/investigations/history").then(async (response) => {
      if (response.status === 401) { router.replace("/login?returnTo=%2Fhistory"); return; }
      const body = await response.json() as { investigations?: InvestigationReport[] };
      setItems(body.investigations ?? []);
    }).finally(() => setLoaded(true));
  }, [router]);

  return <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12"><section className="mx-auto max-w-3xl rounded-2xl border border-purple-100 bg-white p-7 shadow-lg">
    <Link href="/scan" className="text-sm font-medium text-purple-700">← New investigation</Link>
    <h1 className="mt-4 text-3xl font-bold text-purple-950">Investigation history</h1>
    {!loaded ? <p className="mt-5 text-purple-700">Loading…</p> : items.length ? <ul className="mt-5 divide-y divide-purple-100">{items.map((item) => <li key={item.investigationId} className="py-4"><Link href={`/results?id=${encodeURIComponent(item.investigationId)}`} className="font-semibold text-purple-900 hover:underline">{item.platform} · {item.username}</Link><p className="mt-1 text-sm text-purple-600">{new Date(item.generatedAt).toLocaleString()} · {(item.status ?? item.completedStatus ?? "blocked").replaceAll("_", " ")} · {item.findings.length} finding(s)</p></li>)}</ul> : <p className="mt-5 text-purple-700">No saved investigations yet.</p>}
  </section></main>;
}
