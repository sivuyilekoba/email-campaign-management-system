import type { Meta, StoryObj } from '@storybook/angular';
import { StatusBadgeComponent } from './status-badge.component';

const meta: Meta<StatusBadgeComponent> = {
  title: 'Shared/StatusBadge',
  component: StatusBadgeComponent,
};

export default meta;
type Story = StoryObj<StatusBadgeComponent>;

export const Queued: Story = { args: { status: 'queued' } };
export const Processing: Story = { args: { status: 'processing' } };
export const Done: Story = { args: { status: 'done' } };
export const Pending: Story = { args: { status: 'pending' } };
export const Sent: Story = { args: { status: 'sent' } };
export const Failed: Story = { args: { status: 'failed' } };
