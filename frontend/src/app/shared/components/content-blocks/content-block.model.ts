export type BlockType = 'header' | 'text' | 'image' | 'button';

export interface HeaderBlock {
  id: string;
  type: 'header';
  text: string;
}

export interface TextBlock {
  id: string;
  type: 'text';
  text: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
}

export interface ButtonBlock {
  id: string;
  type: 'button';
  label: string;
  url: string;
}

export type TemplateBlock = HeaderBlock | TextBlock | ImageBlock | ButtonBlock;

export function createBlock(type: BlockType, id: string = generateBlockId()): TemplateBlock {
  switch (type) {
    case 'header':
      return { id, type, text: '' };
    case 'text':
      return { id, type, text: '' };
    case 'image':
      return { id, type, url: '', alt: '' };
    case 'button':
      return { id, type, label: '', url: '' };
    default:
      return unsupportedBlockType(type);
  }
}

export function generateBlockId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function unsupportedBlockType(type: never): never {
  throw new Error(`Unsupported block type: ${String(type)}`);
}
