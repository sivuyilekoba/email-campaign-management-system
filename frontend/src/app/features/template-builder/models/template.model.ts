import type { TemplateBlock } from '../../../shared/components/content-blocks/content-block.model';

export interface Template {
  id: number;
  name: string;
  blocks: TemplateBlock[];
  created_at: string;
  updated_at: string;
}
