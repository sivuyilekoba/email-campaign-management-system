import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TemplateBuilderService } from '../../services/template-builder.service';
import { TemplateBuilderComponent } from './template-builder.component';

describe('TemplateBuilderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateBuilderComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('adds a block and reflects its edits in the live preview', () => {
    const fixture = TestBed.createComponent(TemplateBuilderComponent);
    fixture.detectChanges();

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    );
    const addHeader = buttons.find((button) => button.textContent?.trim() === 'Header');

    expect(addHeader).toBeTruthy();

    (addHeader as HTMLButtonElement).click();
    fixture.detectChanges();

    const service = TestBed.inject(TemplateBuilderService);
    expect(service.blocks().length).toBe(1);
    expect(service.blocks()[0].type).toBe('header');

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      '#header-text',
    ) as HTMLInputElement;
    input.value = 'Spring Sale is here';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const preview = (fixture.nativeElement as HTMLElement).querySelector(
      'app-template-preview',
    ) as HTMLElement;
    expect(preview.textContent).toContain('Spring Sale is here');
  });

  it('shows an empty-state hint when no blocks have been added', () => {
    const fixture = TestBed.createComponent(TemplateBuilderComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('No blocks yet');
  });
});
