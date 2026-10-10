import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { Template } from '../models/template.model';
import { SaveTemplatePayload, TemplateService } from './template.service';

describe('TemplateService', () => {
  let service: TemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists templates from the paginated endpoint', () => {
    const page: PaginatedResponse<Template> = {
      data: [
        {
          id: 1,
          name: 'Welcome',
          blocks: [{ id: 'b1', type: 'header', text: 'Hi' }],
          created_at: '2026-10-10T10:00:00.000000Z',
          updated_at: '2026-10-10T10:00:00.000000Z',
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
      expect(response.data[0].name).toBe('Welcome');
    });

    const req = httpMock.expectOne('/api/templates?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(page);
  });

  it('creates a template with its blocks', () => {
    const payload: SaveTemplatePayload = {
      name: 'Welcome',
      blocks: [{ id: 'b1', type: 'header', text: 'Hi' }],
    };
    const created: Template = {
      id: 1,
      name: payload.name,
      blocks: payload.blocks,
      created_at: '2026-10-10T10:00:00.000000Z',
      updated_at: '2026-10-10T10:00:00.000000Z',
    };

    service.create(payload).subscribe((response) => {
      expect(response.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/templates');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
  });

  it('updates a template', () => {
    const payload: SaveTemplatePayload = {
      name: 'Updated',
      blocks: [{ id: 'b1', type: 'text', text: 'Changed' }],
    };

    service.update(1, payload).subscribe((response) => {
      expect(response.name).toBe('Updated');
    });

    const req = httpMock.expectOne('/api/templates/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...payload, id: 1, created_at: '', updated_at: '' });
  });

  it('deletes a template', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne('/api/templates/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
