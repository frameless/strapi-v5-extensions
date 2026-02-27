export default {
  kind: 'collectionType',
  collectionName: 'notes',
  info: {
    singularName: 'note',
    pluralName: 'notes',
    displayName: 'notes',
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  options: {
    draftAndPublish: false,
    comment: '',
  },
  attributes: {
    title: {
      type: 'string',
    },
    content: {
      type: 'text',
    },
    entitySlug: {
      type: 'string',
    },
    entityId: {
      type: 'string',
    },
  },
};
