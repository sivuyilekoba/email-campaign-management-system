import { Component, input } from '@angular/core';

import type { HeaderBlock } from '../content-block.model';

@Component({
  selector: 'app-header-block',
  standalone: true,
  templateUrl: './header-block.component.html',
  styleUrl: './header-block.component.scss',
})
export class HeaderBlockComponent {
  readonly block = input.required<HeaderBlock>();
}
