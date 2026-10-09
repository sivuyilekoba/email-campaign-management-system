import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CampaignService } from '../../services/campaign.service';
import { CampaignCreateComponent } from './campaign-create.component';

describe('CampaignCreateComponent', () => {
  let fixture: ComponentFixture<CampaignCreateComponent>;
  let component: CampaignCreateComponent;
  let campaignService: jasmine.SpyObj<CampaignService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CampaignService', ['create']);

    await TestBed.configureTestingModule({
      imports: [CampaignCreateComponent],
      providers: [provideRouter([]), { provide: CampaignService, useValue: spy }],
    }).compileComponents();

    campaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
    fixture = TestBed.createComponent(CampaignCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('does not submit when the form is invalid', () => {
    component.onSubmit();

    expect(campaignService.create).not.toHaveBeenCalled();
    expect(component.submission()).toBeNull();
  });

  it('submits valid data and displays the returned campaign id and count', () => {
    const result = { campaign_id: 5, recipient_count: 2, status: 'queued' as const };
    campaignService.create.and.returnValue(of(result));

    component.form.setValue({
      name: 'Spring Sale',
      subject: '50% Off',
      body: 'Deals!',
      recipientEmails: 'a@test.com\nb@test.com',
    });

    component.onSubmit();

    expect(campaignService.create).toHaveBeenCalledWith({
      name: 'Spring Sale',
      subject: '50% Off',
      body: 'Deals!',
      recipient_emails: ['a@test.com', 'b@test.com'],
    });
    expect(component.submission()).toEqual(result);
  });
});
