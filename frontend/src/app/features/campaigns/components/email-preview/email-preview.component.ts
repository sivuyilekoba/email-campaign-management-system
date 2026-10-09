import { Component, input } from '@angular/core';

@Component({
  selector: 'app-email-preview',
  standalone: true,
  templateUrl: './email-preview.component.html',
  styleUrl: './email-preview.component.scss',
})
export class EmailPreviewComponent {
  readonly subject = input('');
  readonly body = input('');
}
