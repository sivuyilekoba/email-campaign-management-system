import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { BlockType } from '../../../../shared/components/content-blocks/content-block.model';
import { BlockCanvasItemComponent } from '../../components/block-canvas-item/block-canvas-item.component';
import { BlockEditorComponent } from '../../components/block-editor/block-editor.component';
import { BlockToolbarComponent } from '../../components/block-toolbar/block-toolbar.component';
import { TemplatePreviewComponent } from '../../components/template-preview/template-preview.component';
import { TemplateBuilderService } from '../../services/template-builder.service';

@Component({
  selector: 'app-template-builder',
  standalone: true,
  imports: [
    RouterLink,
    BlockToolbarComponent,
    BlockCanvasItemComponent,
    BlockEditorComponent,
    TemplatePreviewComponent,
  ],
  templateUrl: './template-builder.component.html',
})
export class TemplateBuilderComponent {
  readonly builder = inject(TemplateBuilderService);

  onAddBlock(type: BlockType): void {
    this.builder.addBlock(type);
  }
}
