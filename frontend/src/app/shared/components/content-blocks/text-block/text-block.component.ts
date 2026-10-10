import { Component, input } from '@angular/core';

import type { TextBlock } from '../content-block.model';

@Component({
  selector: 'app-text-block',
  standalone: true,
  templateUrl: './text-block.component.html',
  styleUrl: './text-block.component.scss',
})
export class TextBlockComponent {
  readonly block = input.required<TextBlock>();
}
