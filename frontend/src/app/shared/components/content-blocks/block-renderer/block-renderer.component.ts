import { NgComponentOutlet } from '@angular/common';
import { Component, input, Type } from '@angular/core';

import { ButtonBlockComponent } from '../button-block/button-block.component';
import type { BlockType, TemplateBlock } from '../content-block.model';
import { HeaderBlockComponent } from '../header-block/header-block.component';
import { ImageBlockComponent } from '../image-block/image-block.component';
import { TextBlockComponent } from '../text-block/text-block.component';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './block-renderer.component.html',
})
export class BlockRendererComponent {
  readonly block = input.required<TemplateBlock>();

  private readonly componentsByType: Record<BlockType, Type<unknown>> = {
    header: HeaderBlockComponent,
    text: TextBlockComponent,
    image: ImageBlockComponent,
    button: ButtonBlockComponent,
  };

  componentFor(type: BlockType): Type<unknown> {
    return this.componentsByType[type];
  }
}
