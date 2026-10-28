import type { TrustIndex as ITrustIndex, TrustIndexComponents } from '@/types';

export class TrustIndexEntity implements ITrustIndex {
  public readonly projectId?: string;
  public readonly companyId?: string;
  public readonly score?: number;
  public readonly trustScore?: number;
  public readonly grade?: string;
  public readonly components: TrustIndexComponents;
  public readonly lastUpdated: string;
  public readonly isMock?: boolean;
  public readonly status?: string;
  public readonly message?: string;

  constructor(data: Partial<ITrustIndex> & { isMock?: boolean; status?: string; message?: string }) {
    this.projectId = data.projectId;
    this.companyId = data.companyId;
    this.score = Number(data.score ?? data.trustScore ?? 90);
    this.trustScore = this.score;
    this.grade = data.grade || this.computeGrade(this.score);
    this.components = data.components || {
      kycVerification: 25,
      escrowDiscipline: 30,
      milestoneReality: 39,
      complianceScore: 20,
    };
    this.isMock = data.isMock;
    this.status = data.status;
    this.message = data.message;
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
  }

  private computeGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    return 'C';
  }

  public getGradeColor(): string {
    const s = this.score || 90;
    if (s >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (s >= 80) return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    if (s >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  public getRadarChartData(): Array<{ subject: string; score: number; fullMark: number }> {
    const c = this.components;
    return [
      { subject: 'KYC & Legal', score: c.kycVerification || c.documentVerification || 95, fullMark: 100 },
      { subject: 'Escrow Health', score: c.escrowDiscipline || c.escrowHealth || 90, fullMark: 100 },
      { subject: 'Proof of Reality', score: c.milestoneReality || c.geofencePassRate || 95, fullMark: 100 },
      { subject: 'Compliance', score: c.complianceScore || 90, fullMark: 100 },
    ];
  }

  public isHighTrust(): boolean {
    return (this.score || 0) >= 85;
  }

  public toJSON(): ITrustIndex & { isMock?: boolean; status?: string; message?: string } {
    return {
      projectId: this.projectId,
      companyId: this.companyId,
      score: this.score,
      trustScore: this.trustScore,
      grade: this.grade,
      components: this.components,
      isMock: this.isMock,
      status: this.status,
      message: this.message,
      lastUpdated: this.lastUpdated,
    };
  }

  public static fromJSON(data: any): TrustIndexEntity {
    return new TrustIndexEntity(data);
  }
}
