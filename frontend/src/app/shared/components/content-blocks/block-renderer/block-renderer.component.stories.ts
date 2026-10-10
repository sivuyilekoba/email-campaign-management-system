import type { Meta, StoryObj } from '@storybook/angular';
import { BlockRendererComponent } from './block-renderer.component';

const meta: Meta<BlockRendererComponent> = {
  title: 'Shared/ContentBlocks/BlockRenderer',
  component: BlockRendererComponent,
};

export default meta;
type Story = StoryObj<BlockRendererComponent>;

export const Header: Story = {
  args: { block: { id: 'header-1', type: 'header', text: 'Spring Sale is here!' } },
};

export const Text: Story = {
  args: {
    block: { id: 'text-1', type: 'text', text: 'Check out our amazing deals.' },
  },
};

export const Image: Story = {
  args: {
    block: {
      id: 'image-1',
      type: 'image',
      url: 'https://placehold.co/600x300?text=Spring+Sale',
      alt: 'Spring sale banner',
    },
  },
};

export const Button: Story = {
  args: {
    block: {
      id: 'button-1',
      type: 'button',
      label: 'Shop the sale',
      url: 'https://example.com/sale',
    },
  },
};
