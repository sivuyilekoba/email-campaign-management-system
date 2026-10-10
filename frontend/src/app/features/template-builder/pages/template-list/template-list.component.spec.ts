import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TemplateListComponent } from './template-list.component';

describe('TemplateListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateListComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('renders templates returned by the API', () => {
    const fixture = TestBed.createComponent(TemplateListComponent);
    const httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const req = httpMock.expectOne('/api/templates?page=1');
    req.flush({
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
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Welcome');
    expect(element.textContent).toContain('1');
  });
});
