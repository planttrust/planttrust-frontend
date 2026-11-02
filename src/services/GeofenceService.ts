import { BaseApiClient } from './BaseApiClient';
import type { MilestoneReportResult, MilestoneTimelineItem } from '@/types';

export class GeofenceService extends BaseApiClient {
  constructor(baseUrl?: string) {
    super(baseUrl || process.env.NEXT_PUBLIC_MODULE4_URL);
  }

  public async getProjectsStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/projects');
  }

  public async getReportsStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/reports');
  }

  public async getGeofenceStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/geofence');
  }

  public async registerProject(payload: any): Promise<any> {
    return this.request('/api/projects/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getTimeline(projectId: string): Promise<{ projectId: string; milestones: MilestoneTimelineItem[] }> {
    return this.request<{ projectId: string; milestones: MilestoneTimelineItem[] }>(`/api/projects/${projectId}/timeline`);
  }

  public async submitReport(formData: FormData): Promise<MilestoneReportResult> {
    return this.request<MilestoneReportResult>('/api/reports/submit', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  }
}

const geofenceService = new GeofenceService();
export default geofenceService;
