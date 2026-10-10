import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import type {
  ButtonBlock,
  HeaderBlock,
  ImageBlock,
  TemplateBlock,
  TextBlock,
} from '../../../../shared/components/content-blocks/content-block.model';
import { TemplateBuilderService } from '../../services/template-builder.service';

@Component({
  selector: 'app-block-editor',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './block-editor.component.html',
  styleUrl: './block-editor.component.scss',
})
export class BlockEditorComponent {
  private readonly templateBuilder = inject(TemplateBuilderService);

  readonly block = input<TemplateBlock | null>(null);

  readonly headerBlock = computed<HeaderBlock | null>(() =>
    this.block()?.type === 'header' ? (this.block() as HeaderBlock) : null,
  );

  readonly textBlock = computed<TextBlock | null>(() =>
    this.block()?.type === 'text' ? (this.block() as TextBlock) : null,
  );

  readonly imageBlock = computed<ImageBlock | null>(() =>
    this.block()?.type === 'image' ? (this.block() as ImageBlock) : null,
  );

  readonly buttonBlock = computed<ButtonBlock | null>(() =>
    this.block()?.type === 'button' ? (this.block() as ButtonBlock) : null,
  );

  updateHeaderText(event: Event): void {
    const block = this.headerBlock();

    if (!block) {
      return;
    }

    this.templateBuilder.updateText(block.id, (event.target as HTMLInputElement).value);
  }

  updateBodyText(event: Event): void {
    const block = this.textBlock();

    if (!block) {
      return;
    }

    this.templateBuilder.updateText(block.id, (event.target as HTMLTextAreaElement).value);
  }

  updateImageUrl(event: Event): void {
    const block = this.imageBlock();

    if (!block) {
      return;
    }

    this.templateBuilder.updateImage(block.id, (event.target as HTMLInputElement).value, block.alt);
  }

  updateImageAlt(event: Event): void {
    const block = this.imageBlock();

    if (!block) {
      return;
    }

    this.templateBuilder.updateImage(block.id, block.url, (event.target as HTMLInputElement).value);
  }

  updateButtonLabel(event: Event): void {
    const block = this.buttonBlock();

    if (!block) {
      return;
    }

    this.templateBuilder.updateButton(
      block.id,
      (event.target as HTMLInputElement).value,
      block.url,
    );
  }

  updateButtonUrl(event: Event): void {
    const block = this.buttonBlock();

    if (!block) {
      return;
    }

    this.templateBuilder.updateButton(
      block.id,
      block.label,
      (event.target as HTMLInputElement).value,
    );
  }
}
