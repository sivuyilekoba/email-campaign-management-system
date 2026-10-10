import { TestBed } from '@angular/core/testing';

import type { TemplateBlock } from '../content-block.model';
import { BlockRendererComponent } from './block-renderer.component';

describe('BlockRendererComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockRendererComponent],
    }).compileComponents();
  });

  function render(block: TemplateBlock): HTMLElement {
    const fixture = TestBed.createComponent(BlockRendererComponent);
    fixture.componentRef.setInput('block', block);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a header block with its text', () => {
    const element = render({ id: 'h1', type: 'header', text: 'Spring Sale' });

    expect(element.querySelector('app-header-block')).toBeTruthy();
    expect(element.textContent).toContain('Spring Sale');
  });

  it('renders a text block with its text', () => {
    const element = render({ id: 't1', type: 'text', text: 'Amazing deals!' });

    expect(element.querySelector('app-text-block')).toBeTruthy();
    expect(element.textContent).toContain('Amazing deals!');
  });

  it('renders an image block with its source and alt text', () => {
    const element = render({
      id: 'i1',
      type: 'image',
      url: 'https://example.com/banner.png',
      alt: 'Sale banner',
    });

    expect(element.querySelector('app-image-block')).toBeTruthy();
    const image = element.querySelector('img') as HTMLImageElement;
    expect(image.src).toContain('banner.png');
    expect(image.alt).toBe('Sale banner');
  });

  it('renders a button block with its label and link', () => {
    const element = render({
      id: 'b1',
      type: 'button',
      label: 'Shop now',
      url: 'https://example.com/sale',
    });

    expect(element.querySelector('app-button-block')).toBeTruthy();
    const link = element.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent).toContain('Shop now');
    expect(link.href).toBe('https://example.com/sale');
  });

  it('renders a placeholder for an empty header', () => {
    const element = render({ id: 'h1', type: 'header', text: '' });

    expect(element.textContent).toContain('Heading text');
  });
});
