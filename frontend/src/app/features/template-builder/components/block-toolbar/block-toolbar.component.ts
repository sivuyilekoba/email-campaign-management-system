import { TitleCasePipe } from '@angular/common';
import { Component, output } from '@angular/core';

import type { BlockType } from '../../../../shared/components/content-blocks/content-block.model';

@Component({
  selector: 'app-block-toolbar',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './block-toolbar.component.html',
  styleUrl: './block-toolbar.component.scss',
})
export class BlockToolbarComponent {
  readonly add = output<BlockType>();

  readonly blockTypes: BlockType[] = ['header', 'text', 'image', 'button'];

  onAdd(type: BlockType): void {
    this.add.emit(type);
  }
}
