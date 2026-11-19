/** Copied from planttrust-backend contracts/m2-marketplace.md. Keep the two in sync. */
export interface Listing {
  projectId: string;
  title: string;
  location: string;
  fundingGoal: number;
  fundedAmount: number;
  status: 'open' | 'fully_funded' | 'closed';
}

export interface ModuleHealth {
  module: string;
  status: string;
}
