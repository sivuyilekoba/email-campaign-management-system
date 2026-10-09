export type EmailJobStatus = 'pending' | 'sent' | 'failed';

export interface EmailJob {
  id: number;
  recipient_email: string;
  status: EmailJobStatus;
  created_at: string;
}
