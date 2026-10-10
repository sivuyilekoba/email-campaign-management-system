import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [RouterLink, DatePipe, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './template-list.component.html',
})
export class TemplateListComponent {
  private readonly templateService = inject(TemplateService);

  readonly templates = signal<Template[]>([]);
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

    this.templateService.list(page).subscribe({
      next: (response) => {
        this.templates.set(response.data);
        this.currentPage.set(response.meta.current_page);
        this.lastPage.set(response.meta.last_page);
        this.total.set(response.meta.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load templates. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage() && page !== this.currentPage()) {
      this.load(page);
    }
  }

  onDelete(template: Template): void {
    if (!window.confirm(`Delete template "${template.name}"?`)) {
      return;
    }

    this.templateService.delete(template.id).subscribe({
      next: () => this.load(this.currentPage()),
      error: () => {
        this.error.set('Unable to delete the template. Please try again later.');
      },
    });
  }
}
