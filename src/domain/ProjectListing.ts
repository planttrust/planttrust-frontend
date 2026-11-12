import type { ProjectListing as IProjectListing, RiskLevel, ListingStatus } from '@/types';

export class ProjectListingEntity implements IProjectListing {
  public readonly id: string;
  public readonly listingId?: string;
  public readonly projectId?: string;
  public readonly companyId: string;
  public readonly companyName: string;
  public readonly title: string;
  public readonly projectName?: string;
  public readonly category?: string;
  public readonly description: string;
  public readonly location?: string;
  public readonly targetAmount: number;
  public readonly fundedAmount: number;
  public readonly minInvestment: number;
  public readonly returnRate?: number;
  public readonly expectedReturn?: string;
  public readonly tenureMonths?: number;
  public readonly region?: string;
  public readonly trustScore: number;
  public readonly trustGrade?: string;
  public readonly riskLevel: RiskLevel;
  public readonly status: ListingStatus;
  public readonly nftTokenId?: string;

  constructor(data: IProjectListing) {
    this.id = data.id || data.listingId || data.projectId || '';
    this.listingId = data.listingId || this.id;
    this.projectId = data.projectId || this.id;
    this.companyId = data.companyId;
    this.companyName = data.companyName;
    this.title = data.title || data.projectName || 'Untitled Project';
    this.projectName = this.title;
    this.category = data.category || 'Agriculture';
    this.description = data.description || '';
    this.location = data.location || data.region || 'Sri Lanka';
    this.targetAmount = Number(data.targetAmount) || 0;
    this.fundedAmount = Number(data.fundedAmount) || 0;
    this.minInvestment = Number(data.minInvestment) || 1000;
    this.returnRate = data.returnRate;
    this.expectedReturn = data.expectedReturn || (data.returnRate ? `${data.returnRate}% p.a.` : '18-22% p.a.');
    this.tenureMonths = data.tenureMonths || 12;
    this.region = data.region || this.location;
    this.trustScore = Number(data.trustScore) || 90;
    this.trustGrade = data.trustGrade || this.computeGrade(this.trustScore);
    this.riskLevel = data.riskLevel || 'Low';
    this.status = data.status || 'open';
    this.nftTokenId = data.nftTokenId;
  }

  public getFundingProgress(): number {
    if (this.targetAmount <= 0) return 0;
    return Math.min(100, Math.round((this.fundedAmount / this.targetAmount) * 100));
  }

  public isFullyFunded(): boolean {
    return this.fundedAmount >= this.targetAmount || this.status === 'fully_funded';
  }

  public getRemainingAmount(): number {
    return Math.max(0, this.targetAmount - this.fundedAmount);
  }

  public getFormattedTargetAmount(currency = 'LKR'): string {
    return `${currency} ${this.targetAmount.toLocaleString()}`;
  }

  public getFormattedFundedAmount(currency = 'LKR'): string {
    return `${currency} ${this.fundedAmount.toLocaleString()}`;
  }

  public getRiskColor(): string {
    const risk = String(this.riskLevel).toLowerCase();
    if (risk === 'low') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (risk === 'medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  private computeGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    return 'C';
  }

  public toJSON(): IProjectListing {
    return {
      id: this.id,
      listingId: this.listingId,
      projectId: this.projectId,
      companyId: this.companyId,
      companyName: this.companyName,
      title: this.title,
      projectName: this.projectName,
      category: this.category,
      description: this.description,
      location: this.location,
      targetAmount: this.targetAmount,
      fundedAmount: this.fundedAmount,
      minInvestment: this.minInvestment,
      returnRate: this.returnRate,
      expectedReturn: this.expectedReturn,
      tenureMonths: this.tenureMonths,
      region: this.region,
      trustScore: this.trustScore,
      trustGrade: this.trustGrade,
      riskLevel: this.riskLevel,
      status: this.status,
      nftTokenId: this.nftTokenId,
    };
  }

  public static fromJSON(data: any): ProjectListingEntity {
    return new ProjectListingEntity(data);
  }
}
