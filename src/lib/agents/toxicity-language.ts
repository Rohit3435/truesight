import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding, InvestigationContext } from "../investigation/types.ts";
import { HuggingFaceTextClassifier } from "../providers/huggingface-classifier.ts";

const MAX_CAPTIONS_PER_RUN = 5;

/**
 * Calls a configured, model-specific classifier only after explicit external
 * provider consent. Outputs remain model labels for human review, never a
 * person-level toxicity or trust score.
 */
export class ToxicityLanguageAgent implements InvestigationAgent {
  readonly name = "toxicity-language";
  private readonly classifier: HuggingFaceTextClassifier;

  constructor(classifier = new HuggingFaceTextClassifier()) {
    this.classifier = classifier;
  }

  canRun(context: InvestigationContext): boolean {
    return context.externalProviderConsent === true
      && this.classifier.isConfigured()
      && context.evidence.some((item) => item.kind !== "image" && item.content.trim().length > 0);
  }

  async run(context: InvestigationContext): Promise<AgentOutput> {
    const captions = context.evidence.filter((item) => item.kind !== "image" && item.content.trim()).slice(0, MAX_CAPTIONS_PER_RUN);
    const findings: Finding[] = [];
    const limitations: string[] = [
      "Classification labels are model-specific predictions and require human review; they are not a judgment about the profile owner.",
      "Submitted text was sent to the configured Hugging Face Inference endpoint after external-provider consent.",
    ];
    let succeeded = 0;

    for (const [index, caption] of captions.entries()) {
      try {
        const predictions = await this.classifier.classify(caption.content);
        succeeded += 1;
        for (const [predictionIndex, prediction] of predictions.entries()) {
          findings.push({
            id: `${this.name}-${caption.id}-${index}-${predictionIndex}`,
            agent: this.name,
            title: "Model text classification output",
            observation: `The configured classifier returned the label “${prediction.label}” for this supplied caption.`,
            evidenceIds: [caption.id],
            confidence: "limited",
            verification: "requires_review",
            modelOutput: {
              provider: this.classifier.providerName,
              model: this.classifier.modelName,
              label: prediction.label,
              probability: prediction.score,
            },
          });
        }
      } catch {
        limitations.push(`Classification was unavailable for evidence ${caption.id}.`);
      }
    }

    if (succeeded === 0) throw new Error("Hugging Face classification failed for all supplied captions.");
    if (context.evidence.filter((item) => item.kind !== "image" && item.content.trim()).length > MAX_CAPTIONS_PER_RUN) {
      limitations.push(`Only the first ${MAX_CAPTIONS_PER_RUN} text items were sent for classification.`);
    }

    return {
      agent: this.name,
      status: "completed",
      summary: `Returned model-specific labels for ${succeeded} supplied text item(s).`,
      findings,
      limitations,
    };
  }
}
