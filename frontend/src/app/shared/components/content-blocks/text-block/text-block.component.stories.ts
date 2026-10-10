import type { Meta, StoryObj } from '@storybook/angular';
import { TextBlockComponent } from './text-block.component';

const meta: Meta<TextBlockComponent> = {
  title: 'Shared/ContentBlocks/TextBlock',
  component: TextBlockComponent,
};

export default meta;
type Story = StoryObj<TextBlockComponent>;

export const Populated: Story = {
  args: {
    block: {
      id: 'text-1',
      type: 'text',
      text: 'Check out our amazing deals before they run out.',
    },
  },
};

export const Empty: Story = {
  args: { block: { id: 'text-1', type: 'text', text: '' } },
};
