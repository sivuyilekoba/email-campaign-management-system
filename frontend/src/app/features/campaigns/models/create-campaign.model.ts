export interface CreateCampaignPayload {
  name: string;
  subject: string;
  body: string;
  recipient_emails: string[];
}
