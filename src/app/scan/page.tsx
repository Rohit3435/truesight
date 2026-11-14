"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileImage, FileText, Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeProfileInput, ProfileInputError, type SocialPlatform } from "@/lib/profile-input";
import { motion } from "framer-motion";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_TEXT_CHARS = 12_000;

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [profileInput, setProfileInput] = useState("");
  const [evidenceKind, setEvidenceKind] = useState("profile");
  const [evidenceText, setEvidenceText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [analysisConsent, setAnalysisConsent] = useState(false);
  const [externalProviderConsent, setExternalProviderConsent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function chooseImage(file?: File) {
    setError("");
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Use a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image files must be 3 MB or smaller.");
      return;
    }
    setImage(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!analysisConsent) {
      setError("Confirm that you have permission to submit this material for analysis.");
      return;
    }
    if (!evidenceText.trim() && !image) {
      setError("Add profile text or captions, or attach an optional image.");
      return;
    }
    if (evidenceText.length > MAX_TEXT_CHARS) {
      setError(`Evidence text must be ${MAX_TEXT_CHARS.toLocaleString()} characters or fewer.`);
      return;
    }

    let normalized;
    try {
      normalized = normalizeProfileInput(platform, profileInput);
    } catch (validationError) {
      setError(validationError instanceof ProfileInputError ? validationError.message : "Enter a valid profile or username.");
      return;
    }

    const body = new FormData();
    body.set("platform", normalized.platform);
    body.set("profile", profileInput);
    body.set("evidenceKind", evidenceKind);
    body.set("evidenceText", evidenceText);
    body.set("externalProviderConsent", String(externalProviderConsent));
    if (image) body.set("evidenceImage", image, image.name);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/investigations", { method: "POST", body });
      const payload = await response.json() as { report?: unknown; error?: string };
      if (!response.ok || !payload.report) throw new Error(payload.error || "Analysis request failed.");
      sessionStorage.setItem("investigationReport", JSON.stringify(payload));
      router.push("/results");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The evidence could not be analyzed. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 px-4 py-12">
      <motion.div className="mx-auto max-w-3xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-950">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <section className="overflow-hidden rounded-2xl border border-purple-200 bg-white/95 shadow-xl">
          <div className="bg-gradient-to-r from-purple-800 to-purple-600 px-7 py-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-200">TrueSight evidence review</p>
            <h1 className="mt-2 text-3xl font-bold">Analyze submitted profile material</h1>
            <p className="mt-3 max-w-2xl text-sm text-purple-100">TrueSight reviews only the text or image you provide. It does not fetch profile pages or verify a person’s identity.</p>
          </div>

          <form className="space-y-7 p-6 sm:p-8" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="platform" className="block text-sm font-semibold text-purple-950">Platform</label>
                <select id="platform" value={platform} onChange={(event) => setPlatform(event.target.value as SocialPlatform)} className="h-11 w-full rounded-md border border-purple-300 bg-white px-3 text-purple-950 outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="profile" className="block text-sm font-semibold text-purple-950">Username or profile URL</label>
                <Input id="profile" required value={profileInput} onChange={(event) => setProfileInput(event.target.value)} placeholder={platform === "instagram" ? "username or instagram.com/username" : "username or linkedin.com/in/username"} className="h-11 border-purple-300 focus-visible:ring-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="evidenceKind" className="block text-sm font-semibold text-purple-950">Text evidence type</label>
              <select id="evidenceKind" value={evidenceKind} onChange={(event) => setEvidenceKind(event.target.value)} className="h-11 w-full rounded-md border border-purple-300 bg-white px-3 text-purple-950 outline-none focus:ring-2 focus:ring-purple-500">
                <option value="profile">Profile information / bio</option>
                <option value="caption">Caption or public post text</option>
                <option value="professional_experience">Professional experience</option>
                <option value="education">Education</option>
                <option value="skills">Skills</option>
                <option value="certification">Certification</option>
                <option value="external_url">External URL text or description</option>
              </select>
              <label htmlFor="evidenceText" className="block pt-2 text-sm font-semibold text-purple-950">Paste the relevant text</label>
              <textarea id="evidenceText" value={evidenceText} onChange={(event) => setEvidenceText(event.target.value)} maxLength={MAX_TEXT_CHARS} rows={7} placeholder="Paste only the profile text, caption, or professional details you want reviewed." className="w-full resize-y rounded-md border border-purple-300 bg-white p-3 text-sm text-purple-950 outline-none placeholder:text-purple-400 focus:ring-2 focus:ring-purple-500" />
              <p className="text-right text-xs text-purple-500">{evidenceText.length.toLocaleString()} / {MAX_TEXT_CHARS.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border border-dashed border-purple-300 bg-purple-50/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileImage className="mt-0.5 h-5 w-5 text-purple-700" />
                  <div>
                    <p className="font-semibold text-purple-950">Optional image evidence</p>
                    <p className="mt-1 text-xs text-purple-700">JPEG, PNG, WebP, or GIF · up to 3 MB. It is processed for this request and not stored by this application.</p>
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="border-purple-300 text-purple-800">Choose image</Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => chooseImage(event.target.files?.[0])} />
              {image && <div className="mt-4 flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-purple-900"><span className="flex items-center gap-2"><FileText className="h-4 w-4" />{image.name} · {(image.size / 1024).toFixed(0)} KB</span><button type="button" aria-label="Remove image" onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="rounded p-1 text-purple-600 hover:bg-purple-100"><X className="h-4 w-4" /></button></div>}
            </div>

            <div className="space-y-4 border-t border-purple-100 pt-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-purple-900">
                <input type="checkbox" checked={analysisConsent} onChange={(event) => setAnalysisConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-purple-700" />
                <span>I have permission to submit this material and understand the report describes the submitted evidence only.</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-purple-900">
                <input type="checkbox" checked={externalProviderConsent} onChange={(event) => setExternalProviderConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-purple-700" />
                <span>Allow configured external AI providers to process this evidence. Leave unchecked to keep analysis local; model-based analysis will be skipped.</span>
              </label>
              <p className="flex items-start gap-2 text-xs text-purple-600"><ShieldCheck className="h-4 w-4 shrink-0" /> No profile is automatically scraped. Screenshots and text are not saved to an investigation database.</p>
            </div>

            {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="h-12 w-full bg-gradient-to-r from-purple-800 to-purple-600 text-base font-semibold text-white hover:from-purple-900 hover:to-purple-700">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing submitted evidence…</> : "Analyze submitted evidence"}
            </Button>
          </form>
        </section>
      </motion.div>
    </main>
  );
}
