import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CampaignService } from '../../services/campaign.service';
import { CampaignDetailComponent } from './campaign-detail.component';

describe('CampaignDetailComponent', () => {
  let fixture: ComponentFixture<CampaignDetailComponent>;
  let campaignService: jasmine.SpyObj<CampaignService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CampaignService', ['get']);

    await TestBed.configureTestingModule({
      imports: [CampaignDetailComponent],
      providers: [
        provideRouter([]),
        { provide: CampaignService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();

    campaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
  });

  it('renders the campaign summary, body and recipient statuses', () => {
    campaignService.get.and.returnValue(
      of({
        id: 1,
        name: 'Spring Sale',
        subject: '50% Off',
        body: 'Check out our deals!',
        recipient_count: 2,
        status: 'processing' as const,
        created_at: '2026-10-09T10:00:00.000000Z',
        email_jobs: [
          {
            id: 1,
            recipient_email: 'a@test.com',
            status: 'sent' as const,
            created_at: '2026-10-09T10:00:01.000000Z',
          },
          {
            id: 2,
            recipient_email: 'b@test.com',
            status: 'pending' as const,
            created_at: '2026-10-09T10:00:01.000000Z',
          },
        ],
      }),
    );

    fixture = TestBed.createComponent(CampaignDetailComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Spring Sale');
    expect(compiled.textContent).toContain('Check out our deals!');
    expect(compiled.textContent).toContain('a@test.com');
    expect(compiled.textContent).toContain('b@test.com');
  });
});
