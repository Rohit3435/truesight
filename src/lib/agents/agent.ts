import type { AgentOutput, InvestigationContext } from "../investigation/types.ts";

/** Typed contract keeps each specialist independently runnable and reviewable. */
export interface InvestigationAgent {
  readonly name: string;
  canRun(context: InvestigationContext): boolean;
  run(context: InvestigationContext): Promise<AgentOutput>;
}
