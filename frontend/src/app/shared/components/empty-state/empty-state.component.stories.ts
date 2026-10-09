import type { Meta, StoryObj } from '@storybook/angular';
import { EmptyStateComponent } from './empty-state.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'Shared/EmptyState',
  component: EmptyStateComponent,
};

export default meta;
type Story = StoryObj<EmptyStateComponent>;

export const Default: Story = {
  args: {
    title: 'No campaigns yet',
    message: 'Create your first email campaign to get started.',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Nothing to see here',
    message: '',
  },
};
