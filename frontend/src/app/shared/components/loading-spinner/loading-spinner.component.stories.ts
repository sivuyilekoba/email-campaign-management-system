import type { Meta, StoryObj } from '@storybook/angular';
import { LoadingSpinnerComponent } from './loading-spinner.component';

const meta: Meta<LoadingSpinnerComponent> = {
  title: 'Shared/LoadingSpinner',
  component: LoadingSpinnerComponent,
};

export default meta;
type Story = StoryObj<LoadingSpinnerComponent>;

export const Default: Story = {};
