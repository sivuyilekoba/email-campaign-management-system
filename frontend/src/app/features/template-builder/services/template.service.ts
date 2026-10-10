import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import type { TemplateBlock } from '../../../shared/components/content-blocks/content-block.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { Template } from '../models/template.model';

export interface SaveTemplatePayload {
  name: string;
  blocks: TemplateBlock[];
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/templates`;

  list(page = 1): Observable<PaginatedResponse<Template>> {
    return this.http.get<PaginatedResponse<Template>>(this.baseUrl, {
      params: { page },
    });
  }

  get(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/${id}`);
  }

  create(payload: SaveTemplatePayload): Observable<Template> {
    return this.http.post<Template>(this.baseUrl, payload);
  }

  update(id: number, payload: SaveTemplatePayload): Observable<Template> {
    return this.http.put<Template>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
