import { Component, input } from '@angular/core';

import type { ImageBlock } from '../content-block.model';

@Component({
  selector: 'app-image-block',
  standalone: true,
  templateUrl: './image-block.component.html',
  styleUrl: './image-block.component.scss',
})
export class ImageBlockComponent {
  readonly block = input.required<ImageBlock>();
}
