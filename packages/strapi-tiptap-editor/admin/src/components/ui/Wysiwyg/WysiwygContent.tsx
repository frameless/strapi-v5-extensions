import { Field } from '@strapi/design-system';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';
import { useEditor } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

import defaultSettings from '../../../../../utils/defaults';
import { dispatchLabel, generateLabel } from '../../../utils';
import { mergeDeep } from '../../../utils/merge';
import Editor from '../Editor';
import { useSettings } from '../../../hooks/useSettings';
import { InputProps, PriceListTypes } from '../../../types';
import { useProductPrices } from '../../../hooks/useProductPrices';
import { usePriceStore } from '../../../utils/usePriceStore';

import { useExtensions } from '.';

const Wysiwyg = (props: InputProps) => {
  const { settings: savedSettings, isLoading } = useSettings();
  const settings = mergeDeep(defaultSettings, savedSettings);

  if (isLoading) return null;

  return <WysiwygContent settings={settings} {...props} />;
};

const WysiwygContent = ({
  name,
  onChange,
  value,
  label,
  disabled,
  error,
  hint,
  required,
  settings,
}: InputProps & { settings: typeof defaultSettings }) => {
  const data = useContentManagerContext();
  const { data: productPrice } = useProductPrices({
    collectionUid: data.slug,
    documentId: data.id,
  });

  // Get extensions using the custom hook
  const extensions = useExtensions({ settings });

  // Debounced onChange to prevent excessive saves
  const debouncedOnChange = useMemo(
    () =>
      debounce((content: string) => {
        onChange({ target: { name, value: content } });
      }, 300),
    [name, onChange],
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  // Initialize editor with optimized configuration
  const editor = useEditor(
    {
      extensions,
      parseOptions: {
        preserveWhitespace: 'full',
      },
      autofocus: true,
      editable: !disabled,
      injectCSS: false,
      editorProps: {
        attributes: {
          class: 'utrecht-html utrecht-rich-text-editor-canvas utrecht-rich-text',
        },
      },
      onUpdate: ({ editor }) => {
        const content = settings.other?.saveJson ? JSON.stringify(editor.getJSON()) : editor.getHTML();
        debouncedOnChange(content);
      },
    },
    [extensions], // Only recreate when extensions change
  );

  // Set initial content
  useEffect(() => {
    if (!editor || !value) return;

    // Prevent unnecessary updates if content is the same
    const currentContent = settings.other?.saveJson ? JSON.stringify(editor.getJSON()) : editor.getHTML();

    if (currentContent === value) return;

    try {
      // Try parsing as JSON first
      const json = JSON.parse(value);
      editor.commands.setContent(json, false);
    } catch (e) {
      // If not JSON, set as HTML
      editor.commands.setContent(value, false);
    }
  }, [editor, value, settings.other?.saveJson]);

  // Handle label generation and dispatch
  useEffect(() => {
    if (!value) return;

    const { content, label, labelKey } = generateLabel({ name, content: value });
    dispatchLabel({ key: labelKey, label, name, content });
  }, [value, name]);

  useEffect(() => {
    if (productPrice) {
      usePriceStore.getState().setPrices(productPrice.price);
    } else {
      usePriceStore.getState().setError();
    }
  }, [productPrice]);

  return (
    <Field.Root hint={hint} error={error} required={required}>
      <Field.Label>{label}</Field.Label>
      {editor && (
        <Editor
          key="editor"
          disabled={disabled}
          editor={editor}
          settings={settings}
          productPrice={productPrice as PriceListTypes}
        />
      )}
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};

export default Wysiwyg;
