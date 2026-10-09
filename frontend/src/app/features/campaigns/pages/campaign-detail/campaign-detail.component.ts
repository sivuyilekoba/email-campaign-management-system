import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { CampaignDetail } from '../../models/campaign-detail.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './campaign-detail.component.html',
})
export class CampaignDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly campaignService = inject(CampaignService);

  readonly campaign = signal<CampaignDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('Invalid campaign id.');
      this.loading.set(false);
      return;
    }

    this.campaignService.get(id).subscribe({
      next: (campaign) => {
        this.campaign.set(campaign);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Campaign could not be loaded.');
        this.loading.set(false);
      },
    });
  }
}
