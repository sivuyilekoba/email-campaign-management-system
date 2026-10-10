import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import type { BlockType } from '../../../../shared/components/content-blocks/content-block.model';
import { BlockCanvasItemComponent } from '../../components/block-canvas-item/block-canvas-item.component';
import { BlockEditorComponent } from '../../components/block-editor/block-editor.component';
import { BlockToolbarComponent } from '../../components/block-toolbar/block-toolbar.component';
import { TemplatePreviewComponent } from '../../components/template-preview/template-preview.component';
import { TemplateBuilderService } from '../../services/template-builder.service';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-builder',
  standalone: true,
  imports: [
    RouterLink,
    LoadingSpinnerComponent,
    BlockToolbarComponent,
    BlockCanvasItemComponent,
    BlockEditorComponent,
    TemplatePreviewComponent,
  ],
  templateUrl: './template-builder.component.html',
})
export class TemplateBuilderComponent {
  readonly builder = inject(TemplateBuilderService);

  private readonly templateService = inject(TemplateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly templateId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      const id = Number(idParam);
      this.templateId.set(id);
      this.loadTemplate(id);
    }
  }

  onAddBlock(type: BlockType): void {
    this.builder.addBlock(type);
  }

  onNameInput(event: Event): void {
    this.builder.name.set((event.target as HTMLInputElement).value);
  }

  onSave(): void {
    if (this.saving()) {
      return;
    }

    const name = this.builder.name().trim();
    const blocks = this.builder.blocks();

    if (name.length === 0) {
      this.error.set('Please enter a template name.');
      return;
    }

    if (blocks.length === 0) {
      this.error.set('Please add at least one block to the template.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const id = this.templateId();
    const request =
      id === null
        ? this.templateService.create({ name, blocks })
        : this.templateService.update(id, { name, blocks });

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/templates']);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Unable to save the template. Please try again later.');
      },
    });
  }

  private loadTemplate(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.templateService.get(id).subscribe({
      next: (template) => {
        this.builder.loadTemplate(template.name, template.blocks);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load the template.');
      },
    });
  }
}
