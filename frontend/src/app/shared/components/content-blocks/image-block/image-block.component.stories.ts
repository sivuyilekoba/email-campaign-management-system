import type { Meta, StoryObj } from '@storybook/angular';
import { ImageBlockComponent } from './image-block.component';

const meta: Meta<ImageBlockComponent> = {
  title: 'Shared/ContentBlocks/ImageBlock',
  component: ImageBlockComponent,
};

export default meta;
type Story = StoryObj<ImageBlockComponent>;

export const Populated: Story = {
  args: {
    block: {
      id: 'image-1',
      type: 'image',
      url: 'https://placehold.co/600x300?text=Spring+Sale',
      alt: 'Spring sale banner',
    },
  },
};

export const Empty: Story = {
  args: { block: { id: 'image-1', type: 'image', url: '', alt: '' } },
};
