import { CampaignStatus } from './campaign.model';

export interface CampaignSubmission {
  campaign_id: number;
  recipient_count: number;
  status: CampaignStatus;
}
