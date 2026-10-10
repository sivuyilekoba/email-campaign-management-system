import type { Meta, StoryObj } from '@storybook/angular';
import { HeaderBlockComponent } from './header-block.component';

const meta: Meta<HeaderBlockComponent> = {
  title: 'Shared/ContentBlocks/HeaderBlock',
  component: HeaderBlockComponent,
};

export default meta;
type Story = StoryObj<HeaderBlockComponent>;

export const Populated: Story = {
  args: { block: { id: 'header-1', type: 'header', text: 'Spring Sale is here!' } },
};

export const Empty: Story = {
  args: { block: { id: 'header-1', type: 'header', text: '' } },
};
