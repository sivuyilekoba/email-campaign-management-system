import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'campaigns', pathMatch: 'full' },
  {
    path: 'campaigns',
    loadComponent: () =>
      import('./features/campaigns/pages/campaign-list/campaign-list.component').then(
        (m) => m.CampaignListComponent,
      ),
  },
  {
    path: 'campaigns/new',
    loadComponent: () =>
      import('./features/campaigns/pages/campaign-create/campaign-create.component').then(
        (m) => m.CampaignCreateComponent,
      ),
  },
  {
    path: 'campaigns/:id',
    loadComponent: () =>
      import('./features/campaigns/pages/campaign-detail/campaign-detail.component').then(
        (m) => m.CampaignDetailComponent,
      ),
  },
  {
    path: 'templates',
    loadComponent: () =>
      import('./features/template-builder/pages/template-builder/template-builder.component').then(
        (m) => m.TemplateBuilderComponent,
      ),
  },
  { path: '**', redirectTo: 'campaigns' },
];
