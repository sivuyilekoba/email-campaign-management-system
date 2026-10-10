import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { CampaignDetail } from '../models/campaign-detail.model';
import { CampaignSubmission } from '../models/campaign-submission.model';
import { Campaign } from '../models/campaign.model';
import { CreateCampaignPayload } from '../models/create-campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/campaigns`;

  list(page = 1): Observable<PaginatedResponse<Campaign>> {
    return this.http.get<PaginatedResponse<Campaign>>(this.baseUrl, {
      params: { page },
    });
  }

  get(id: number): Observable<CampaignDetail> {
    return this.http.get<CampaignDetail>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateCampaignPayload): Observable<CampaignSubmission> {
    return this.http.post<CampaignSubmission>(this.baseUrl, payload);
  }
}
