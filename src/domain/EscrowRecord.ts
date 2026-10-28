import type { EscrowRecord as IEscrowRecord, EscrowState, EscrowTransition } from '@/types';

export class EscrowRecordEntity implements IEscrowRecord {
  public readonly escrowId: string;
  public readonly projectId: string;
  public readonly investorId: string;
  public readonly amount: number;
  public currentState: EscrowState;
  public readonly nftTokenId?: string;
  public readonly anchorId?: string;
  public readonly history?: EscrowTransition[];
  public readonly createdAt?: string;

  private static readonly VALID_TRANSITIONS: Record<EscrowState, EscrowState[]> = {
    NONE: ['CREATED'],
    CREATED: ['FUNDED', 'REFUNDED'],
    FUNDED: ['LOCKED', 'REFUNDED'],
    LOCKED: ['RELEASED', 'REFUNDED'],
    RELEASED: [],
    REFUNDED: [],
  };

  constructor(data: Partial<IEscrowRecord> & { escrowId: string; projectId: string; investorId: string; amount: number; currentState?: EscrowState; state?: EscrowState }) {
    this.escrowId = data.escrowId;
    this.projectId = data.projectId;
    this.investorId = data.investorId;
    this.amount = Number(data.amount) || 0;
    this.currentState = data.currentState || data.state || 'CREATED';
    this.nftTokenId = data.nftTokenId;
    this.anchorId = data.anchorId;
    this.history = data.history;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  public get state(): EscrowState {
    return this.currentState;
  }

  public canTransitionTo(nextState: EscrowState): boolean {
    return EscrowRecordEntity.VALID_TRANSITIONS[this.currentState]?.includes(nextState) ?? false;
  }

  public isSettled(): boolean {
    return this.currentState === 'RELEASED' || this.currentState === 'REFUNDED';
  }

  public isFunded(): boolean {
    return this.currentState === 'FUNDED' || this.currentState === 'LOCKED';
  }

  public getFormattedAmount(currency = 'LKR'): string {
    return `${currency} ${this.amount.toLocaleString()}`;
  }

  public getStatusBadgeVariant(): 'success' | 'warning' | 'danger' | 'info' {
    switch (this.currentState) {
      case 'RELEASED':
        return 'success';
      case 'FUNDED':
      case 'LOCKED':
        return 'warning';
      case 'REFUNDED':
        return 'danger';
      default:
        return 'info';
    }
  }

  public toJSON(): IEscrowRecord {
    return {
      escrowId: this.escrowId,
      projectId: this.projectId,
      investorId: this.investorId,
      amount: this.amount,
      currentState: this.currentState,
      nftTokenId: this.nftTokenId,
      anchorId: this.anchorId,
      history: this.history,
      createdAt: this.createdAt,
    };
  }

  public static fromJSON(data: any): EscrowRecordEntity {
    return new EscrowRecordEntity(data);
  }
}
