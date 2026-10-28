import type { ScamCheckResult as IScamCheckResult, ScamTypology } from '@/types';

export class ScamAnalysisEntity implements IScamCheckResult {
  public readonly overallRisk: 'LOW_RISK' | 'MEDIUM_RISK' | 'CRITICAL_RISK' | 'clear';
  public readonly riskScore: number;
  public readonly matchedTypologies: ScamTypology[];
  public readonly cbslGuideline?: string;
  public readonly recommendation?: string;
  public readonly reasoning?: string;
  public readonly projectId?: string;

  constructor(data: Partial<IScamCheckResult> & { projectId?: string; flags?: any[] }) {
    this.overallRisk = data.overallRisk || 'clear';
    this.riskScore = data.riskScore ?? 0;
    this.matchedTypologies = data.matchedTypologies || [];
    this.cbslGuideline = data.cbslGuideline;
    this.recommendation = data.recommendation;
    this.reasoning = data.reasoning;
    this.projectId = data.projectId;
  }

  public isSafe(): boolean {
    return this.overallRisk === 'clear' || this.overallRisk === 'LOW_RISK';
  }

  public isHighRisk(): boolean {
    return this.overallRisk === 'CRITICAL_RISK' || this.overallRisk === 'MEDIUM_RISK';
  }

  public getSeverityColor(): string {
    switch (this.overallRisk) {
      case 'CRITICAL_RISK':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'MEDIUM_RISK':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW_RISK':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  }

  public toJSON(): IScamCheckResult & { projectId?: string } {
    return {
      overallRisk: this.overallRisk,
      riskScore: this.riskScore,
      matchedTypologies: this.matchedTypologies,
      cbslGuideline: this.cbslGuideline,
      recommendation: this.recommendation,
      reasoning: this.reasoning,
      projectId: this.projectId,
    };
  }

  public static fromJSON(data: any): ScamAnalysisEntity {
    return new ScamAnalysisEntity(data);
  }
}
