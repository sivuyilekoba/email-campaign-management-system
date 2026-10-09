import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CampaignDetail } from '../models/campaign-detail.model';
import { CampaignSubmission } from '../models/campaign-submission.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Campaign } from '../models/campaign.model';
import { CampaignService } from './campaign.service';

describe('CampaignService', () => {
  let service: CampaignService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CampaignService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists campaigns from the paginated endpoint', () => {
    const page: PaginatedResponse<Campaign> = {
      data: [
        {
          id: 1,
          name: 'Spring Sale',
          subject: '50% Off',
          recipient_count: 2,
          status: 'queued',
          created_at: '2026-10-09T10:00:00.000000Z',
        },
      ],
      links: { first: null, last: null, prev: null, next: null },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [],
        path: '',
        per_page: 15,
        to: 1,
        total: 1,
      },
    };

    service.list(1).subscribe((response) => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].name).toBe('Spring Sale');
    });

    const req = httpMock.expectOne('/api/campaigns?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(page);
  });

  it('fetches a single campaign with its email jobs', () => {
    const detail: CampaignDetail = {
      id: 1,
      name: 'Spring Sale',
      subject: '50% Off',
      body: 'Deals!',
      recipient_count: 1,
      status: 'done',
      created_at: '2026-10-09T10:00:00.000000Z',
      email_jobs: [
        {
          id: 1,
          recipient_email: 'a@test.com',
          status: 'sent',
          created_at: '2026-10-09T10:00:01.000000Z',
        },
      ],
    };

    service.get(1).subscribe((response) => {
      expect(response.body).toBe('Deals!');
      expect(response.email_jobs.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/campaigns/1');
    expect(req.request.method).toBe('GET');
    req.flush(detail);
  });

  it('creates a campaign and returns the submission', () => {
    const submission: CampaignSubmission = {
      campaign_id: 7,
      recipient_count: 3,
      status: 'queued',
    };

    service
      .create({
        name: 'Spring Sale',
        subject: '50% Off',
        body: 'Deals!',
        recipient_emails: ['a@test.com', 'b@test.com'],
      })
      .subscribe((response) => {
        expect(response.campaign_id).toBe(7);
      });

    const req = httpMock.expectOne('/api/campaigns');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.recipient_emails).toEqual(['a@test.com', 'b@test.com']);
    req.flush(submission);
  });
});
