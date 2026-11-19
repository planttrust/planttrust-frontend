/** Copied from planttrust-backend contracts/m4-geofencing.md. Keep the two in sync. */
export interface ProjectSummary {
  id: string;
  companyId: string;
  title: string;
  location: string;
  fundingGoal: number;
  status: 'draft' | 'open' | 'funded' | 'completed';
}

export interface ModuleHealth {
  module: string;
  status: string;
}
