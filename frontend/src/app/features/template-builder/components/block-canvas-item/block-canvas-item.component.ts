import { Component, input, output } from '@angular/core';

import { BlockRendererComponent } from '../../../../shared/components/content-blocks/block-renderer/block-renderer.component';
import type { TemplateBlock } from '../../../../shared/components/content-blocks/content-block.model';

@Component({
  selector: 'app-block-canvas-item',
  standalone: true,
  imports: [BlockRendererComponent],
  templateUrl: './block-canvas-item.component.html',
  styleUrl: './block-canvas-item.component.scss',
})
export class BlockCanvasItemComponent {
  readonly block = input.required<TemplateBlock>();
  readonly selected = input(false);
  readonly canMoveUp = input(false);
  readonly canMoveDown = input(false);

  readonly select = output<void>();
  readonly moveUp = output<void>();
  readonly moveDown = output<void>();
  readonly remove = output<void>();

  onSelect(): void {
    this.select.emit();
  }

  onMoveUp(event: Event): void {
    event.stopPropagation();
    this.moveUp.emit();
  }

  onMoveDown(event: Event): void {
    event.stopPropagation();
    this.moveDown.emit();
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
