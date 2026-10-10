import { TestBed } from '@angular/core/testing';

import { TemplateBuilderService } from './template-builder.service';

describe('TemplateBuilderService', () => {
  let service: TemplateBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateBuilderService);
  });

  it('adds a block and selects it', () => {
    service.addBlock('header');

    expect(service.blocks().length).toBe(1);
    expect(service.blocks()[0].type).toBe('header');
    expect(service.selectedBlockId()).toBe(service.blocks()[0].id);
    expect(service.selectedBlock()?.id).toBe(service.blocks()[0].id);
  });

  it('appends blocks in the order they are added', () => {
    service.addBlock('header');
    service.addBlock('text');
    service.addBlock('button');

    expect(service.blocks().map((block) => block.type)).toEqual(['header', 'text', 'button']);
  });

  it('removes a block and clears the selection when it was selected', () => {
    service.addBlock('header');

    const id = service.blocks()[0].id;
    service.removeBlock(id);

    expect(service.blocks().length).toBe(0);
    expect(service.selectedBlockId()).toBeNull();
  });

  it('selects the adjacent block when a middle selected block is removed', () => {
    service.addBlock('header');
    service.addBlock('text');
    service.addBlock('image');

    const middle = service.blocks()[1];
    service.selectBlock(middle.id);
    service.removeBlock(middle.id);

    expect(service.blocks().map((block) => block.type)).toEqual(['header', 'image']);
    expect(service.selectedBlockId()).toBe(service.blocks()[1].id);
  });

  it('moves a block up', () => {
    service.addBlock('header');
    service.addBlock('text');

    service.moveBlock(service.blocks()[1].id, 'up');

    expect(service.blocks().map((block) => block.type)).toEqual(['text', 'header']);
  });

  it('does not move the first block up or the last block down', () => {
    service.addBlock('header');
    service.addBlock('text');

    service.moveBlock(service.blocks()[0].id, 'up');
    service.moveBlock(service.blocks()[1].id, 'down');

    expect(service.blocks().map((block) => block.type)).toEqual(['header', 'text']);
  });

  it('updates the text of a text block', () => {
    service.addBlock('text');

    service.updateText(service.blocks()[0].id, 'Hello there');

    const block = service.blocks()[0];
    expect(block.type).toBe('text');
    expect(block.type === 'text' && block.text).toBe('Hello there');
  });

  it('does not change an image block when updateText is called', () => {
    service.addBlock('image');

    service.updateText(service.blocks()[0].id, 'Should not apply');

    const block = service.blocks()[0];
    expect(block.type).toBe('image');
  });

  it('updates the url and alt of an image block', () => {
    service.addBlock('image');

    service.updateImage(service.blocks()[0].id, 'https://example.com/banner.png', 'Sale banner');

    const block = service.blocks()[0];
    if (block.type === 'image') {
      expect(block.url).toBe('https://example.com/banner.png');
      expect(block.alt).toBe('Sale banner');
    } else {
      fail('expected an image block');
    }
  });

  it('updates the label and url of a button block', () => {
    service.addBlock('button');

    service.updateButton(service.blocks()[0].id, 'Shop now', 'https://example.com/sale');

    const block = service.blocks()[0];
    if (block.type === 'button') {
      expect(block.label).toBe('Shop now');
      expect(block.url).toBe('https://example.com/sale');
    } else {
      fail('expected a button block');
    }
  });
});
