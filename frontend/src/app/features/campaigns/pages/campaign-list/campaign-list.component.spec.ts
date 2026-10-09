import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CampaignService } from '../../services/campaign.service';
import { CampaignListComponent } from './campaign-list.component';

describe('CampaignListComponent', () => {
  let fixture: ComponentFixture<CampaignListComponent>;
  let campaignService: jasmine.SpyObj<CampaignService>;

  const emptyPage = {
    data: [],
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: 1,
      from: null,
      last_page: 1,
      links: [],
      path: '',
      per_page: 15,
      to: null,
      total: 0,
    },
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CampaignService', ['list']);

    await TestBed.configureTestingModule({
      imports: [CampaignListComponent],
      providers: [provideRouter([]), { provide: CampaignService, useValue: spy }],
    }).compileComponents();

    campaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
  });

  it('shows an empty state when there are no campaigns', () => {
    campaignService.list.and.returnValue(of(emptyPage));

    fixture = TestBed.createComponent(CampaignListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No campaigns yet');
  });

  it('renders a table row for each campaign', () => {
    campaignService.list.and.returnValue(
      of({
        ...emptyPage,
        data: [
          {
            id: 1,
            name: 'Spring Sale',
            subject: '50% Off',
            recipient_count: 2,
            status: 'queued' as const,
            created_at: '2026-10-09T10:00:00.000000Z',
          },
        ],
        meta: { ...emptyPage.meta, from: 1, to: 1, total: 1 },
      }),
    );

    fixture = TestBed.createComponent(CampaignListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Spring Sale');
    expect(compiled.textContent).toContain('50% Off');
  });
});
