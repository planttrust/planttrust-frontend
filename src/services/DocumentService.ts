import { BaseApiClient } from './BaseApiClient';
import type { DigitalTrustCertificate } from '@/types';

export class DocumentService extends BaseApiClient {
  constructor(baseUrl?: string) {
    super(baseUrl || process.env.NEXT_PUBLIC_MODULE1_URL);
  }

  public async getDocumentsStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/documents');
  }

  public async getCertificatesStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/certificates');
  }

  public async uploadDocument(formData: FormData): Promise<any> {
    return this.request('/api/documents/upload', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  }

  public async verifyCertificate(certificateId: string): Promise<DigitalTrustCertificate> {
    return this.request<DigitalTrustCertificate>(`/api/certificates/${certificateId}/verify`);
  }
}

const documentService = new DocumentService();
export default documentService;
