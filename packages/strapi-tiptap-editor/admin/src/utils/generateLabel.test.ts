import { dispatchLabel, generateLabel } from './generateLabel';

describe('generateLabel', () => {
  it('should generate a label from content', () => {
    const content = '<p>Test content</p>';
    const name = 'testName';

    const result = generateLabel({ content, name });

    expect(result).toEqual({
      label: 'Test content',
      name,
      labelKey: 'richtextContent_testName',
      content,
    });
  });

  it('should handle empty content', () => {
    const result = generateLabel({
      content: '',
      name: 'testName',
    });

    expect(result.label).toBe('');
    expect(result.labelKey).toBe('');
  });

  it('should handle whitespace-only content', () => {
    const result = generateLabel({
      content: '   \n   ',
      name: 'testName',
    });

    expect(result.label).toBe('');
    expect(result.labelKey).toBe('');
  });

  it('should strip all HTML tags', () => {
    const content = '<p><strong>Bold</strong> and <em>italic</em> text</p>';

    const result = generateLabel({
      content,
      name: 'testName',
    });

    expect(result.label).toBe('Bold and italic text');
  });

  it('should normalize new lines into spaces', () => {
    const content = '<p>Line 1\nLine 2</p>';

    const result = generateLabel({
      content,
      name: 'testName',
    });

    expect(result.label).toBe('Line 1 Line 2');
  });

  it('should decode HTML entities', () => {
    const content = '<p>&lt;div&gt;HTML entities&lt;/div&gt;</p>';

    const result = generateLabel({
      content,
      name: 'testName',
    });

    expect(result.label).toBe('HTML entities');
  });

  it('should normalize non-breaking spaces', () => {
    const content = '<p>Hello&nbsp;&nbsp;World</p>';

    const result = generateLabel({
      content,
      name: 'testName',
    });

    expect(result.label).toBe('Hello World');
  });

  it('should truncate long content safely', () => {
    const content = '<p>This is a very long piece of content that should be truncated safely</p>';

    const result = generateLabel({
      content,
      name: 'testName',
      truncateLength: 30,
    });

    expect(result.label.length).toBeLessThanOrEqual(30);
    expect(result.label.endsWith('...')).toBe(true);
  });

  it('should not cut words when truncating', () => {
    const content = '<p>ThisIsAVeryLongWord ThatShouldNotBeCut</p>';

    const result = generateLabel({
      content,
      name: 'testName',
      truncateLength: 20,
    });

    // lodash.truncate falls back to full word if separator not found
    expect(result.label).toBe('ThisIsAVeryLongWo...');
  });
});

describe('dispatchLabel', () => {
  it('should dispatch a custom event with the correct payload', () => {
    const mockDispatchEvent = jest.fn();
    const originalDispatchEvent = window.dispatchEvent;

    window.dispatchEvent = mockDispatchEvent;

    dispatchLabel({
      content: '<p>Test content</p>',
      key: 'testKey',
      label: 'Test label',
      name: 'testName',
    });

    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);

    const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;

    expect(event.type).toBe('labelUpdated');
    expect(event.detail).toEqual({
      key: 'testKey',
      label: 'Test label',
      name: 'testName',
      value: '<p>Test content</p>',
    });

    window.dispatchEvent = originalDispatchEvent;
  });

  it('should not throw when window is undefined (SSR)', () => {
    const originalWindow = global.window;

    delete (global as any).window;

    expect(() =>
      dispatchLabel({
        content: 'content',
        key: 'key',
        label: 'label',
        name: 'name',
      }),
    ).not.toThrow();

    global.window = originalWindow;
  });
});
