import { computed, Injectable, signal } from '@angular/core';

import {
  createBlock,
  type BlockType,
  type TemplateBlock,
} from '../../../shared/components/content-blocks/content-block.model';

@Injectable({ providedIn: 'root' })
export class TemplateBuilderService {
  readonly name = signal('');
  readonly blocks = signal<TemplateBlock[]>([]);
  readonly selectedBlockId = signal<string | null>(null);

  readonly selectedBlock = computed<TemplateBlock | null>(() => {
    const selectedId = this.selectedBlockId();
    return this.blocks().find((block) => block.id === selectedId) ?? null;
  });

  addBlock(type: BlockType): void {
    const block = createBlock(type);
    this.blocks.update((blocks) => [...blocks, block]);
    this.selectedBlockId.set(block.id);
  }

  loadTemplate(name: string, blocks: TemplateBlock[]): void {
    this.name.set(name);
    this.blocks.set([...blocks]);
    this.selectedBlockId.set(null);
  }

  reset(): void {
    this.name.set('');
    this.blocks.set([]);
    this.selectedBlockId.set(null);
  }

  removeBlock(id: string): void {
    const blocks = this.blocks();
    const index = blocks.findIndex((block) => block.id === id);

    if (index === -1) {
      return;
    }

    const remaining = [...blocks.slice(0, index), ...blocks.slice(index + 1)];
    this.blocks.set(remaining);

    if (this.selectedBlockId() === id) {
      const fallbackIndex = Math.min(index, remaining.length - 1);
      this.selectedBlockId.set(remaining[fallbackIndex]?.id ?? null);
    }
  }

  moveBlock(id: string, direction: 'up' | 'down'): void {
    this.blocks.update((blocks) => {
      const index = blocks.findIndex((block) => block.id === id);
      const target = direction === 'up' ? index - 1 : index + 1;

      if (index === -1 || target < 0 || target >= blocks.length) {
        return blocks;
      }

      const reordered = [...blocks];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

      return reordered;
    });
  }

  selectBlock(id: string): void {
    this.selectedBlockId.set(id);
  }

  updateText(id: string, text: string): void {
    this.blocks.update((blocks) =>
      blocks.map((block) => {
        if (block.id !== id) {
          return block;
        }

        if (block.type === 'header' || block.type === 'text') {
          return { ...block, text };
        }

        return block;
      }),
    );
  }

  updateImage(id: string, url: string, alt: string): void {
    this.blocks.update((blocks) =>
      blocks.map((block) => {
        if (block.id !== id) {
          return block;
        }

        if (block.type === 'image') {
          return { ...block, url, alt };
        }

        return block;
      }),
    );
  }

  updateButton(id: string, label: string, url: string): void {
    this.blocks.update((blocks) =>
      blocks.map((block) => {
        if (block.id !== id) {
          return block;
        }

        if (block.type === 'button') {
          return { ...block, label, url };
        }

        return block;
      }),
    );
  }
}
