import { Campaign } from './campaign.model';
import { EmailJob } from './email-job.model';

export interface CampaignDetail extends Campaign {
  body: string;
  email_jobs: EmailJob[];
}
