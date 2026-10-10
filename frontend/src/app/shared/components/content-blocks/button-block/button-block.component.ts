import { Component, input } from '@angular/core';

import type { ButtonBlock } from '../content-block.model';

@Component({
  selector: 'app-button-block',
  standalone: true,
  templateUrl: './button-block.component.html',
  styleUrl: './button-block.component.scss',
})
export class ButtonBlockComponent {
  readonly block = input.required<ButtonBlock>();
}
