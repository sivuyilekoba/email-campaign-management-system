import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { Campaign } from '../../models/campaign.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './campaign-list.component.html',
})
export class CampaignListComponent {
  private readonly campaignService = inject(CampaignService);

  readonly campaigns = signal<Campaign[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly lastPage = signal(1);
  readonly total = signal(0);

  constructor() {
    this.load(1);
  }

  load(page: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.campaignService.list(page).subscribe({
      next: (response) => {
        this.campaigns.set(response.data);
        this.currentPage.set(response.meta.current_page);
        this.lastPage.set(response.meta.last_page);
        this.total.set(response.meta.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load campaigns. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage() && page !== this.currentPage()) {
      this.load(page);
    }
  }
}
