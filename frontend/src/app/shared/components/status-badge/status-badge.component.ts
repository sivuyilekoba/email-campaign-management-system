import { Component, computed, input } from '@angular/core';

export type StatusValue = 'queued' | 'processing' | 'done' | 'pending' | 'sent' | 'failed';

const STATUS_LABELS: Record<StatusValue, string> = {
  queued: 'Queued',
  processing: 'Processing',
  done: 'Done',
  pending: 'Pending',
  sent: 'Sent',
  failed: 'Failed',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  readonly status = input.required<StatusValue>();
  readonly label = computed(() => STATUS_LABELS[this.status()]);
}
