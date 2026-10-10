import { Component, input } from '@angular/core';

import { BlockRendererComponent } from '../../../../shared/components/content-blocks/block-renderer/block-renderer.component';
import type { TemplateBlock } from '../../../../shared/components/content-blocks/content-block.model';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [BlockRendererComponent],
  templateUrl: './template-preview.component.html',
  styleUrl: './template-preview.component.scss',
})
export class TemplatePreviewComponent {
  readonly blocks = input<TemplateBlock[]>([]);
}
