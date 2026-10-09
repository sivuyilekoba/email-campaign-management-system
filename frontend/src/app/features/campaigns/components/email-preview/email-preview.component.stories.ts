import type { Meta, StoryObj } from '@storybook/angular';
import { EmailPreviewComponent } from './email-preview.component';

const meta: Meta<EmailPreviewComponent> = {
  title: 'Campaigns/EmailPreview',
  component: EmailPreviewComponent,
};

export default meta;
type Story = StoryObj<EmailPreviewComponent>;

export const Default: Story = {
  args: {
    subject: '50% Off This Weekend!',
    body: 'Check out our amazing deals before they run out.\n\nBest regards,\nMarketing Team',
  },
};

export const Empty: Story = {
  args: {
    subject: '',
    body: '',
  },
};
