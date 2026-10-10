import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonBlockComponent } from './button-block.component';

const meta: Meta<ButtonBlockComponent> = {
  title: 'Shared/ContentBlocks/ButtonBlock',
  component: ButtonBlockComponent,
};

export default meta;
type Story = StoryObj<ButtonBlockComponent>;

export const Populated: Story = {
  args: {
    block: {
      id: 'button-1',
      type: 'button',
      label: 'Shop the sale',
      url: 'https://example.com/sale',
    },
  },
};

export const Empty: Story = {
  args: { block: { id: 'button-1', type: 'button', label: '', url: '' } },
};
