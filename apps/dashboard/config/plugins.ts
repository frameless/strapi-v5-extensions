export default ({ env }) => ({
  'env-label': {
    enabled: true,
    config: {
      env_label: env('STRAPI_ENV_LABEL'),
    },
  },
  'entity-notes': {
		enabled: true,
	},
  'preview-button': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::vac.vac',
          query: {
            type: 'vac',
          },
          button_label: 'Bekijk op VAC',
        },
        {
          uid: 'api::product.product',
          query: {
            type: 'kennisartikelen',
          },
          button_label: 'Bekijk op Kennisbank',
        },
      ],
      domain: env('FRONTEND_PUBLIC_URL'),
      preview_secret_token: env('PREVIEW_SECRET_TOKEN'),
      api_token: env('STRAPI_API_TOKEN'),
    },
  },
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        introspection: true, // Enable introspection
      },
    },
  },
  publisher: {
    enabled: true,
    config: {
      components: {
        dateTimePicker: {
          step: 15,
        },
      },
    },
  },
  'flo-legal-embed': {
    enabled: true,
    config: {
      api_url: env('FLO_LEGAL_API_URL'),
      token: env('FLO_LEGAL_API_TOKEN'),
    },
  },
  prometheus: {
    enabled: true,
    config: {
      collectDefaultMetrics: false,

      labels: {
        app: 'strapi-v5-sandbox',
        environment: env('NODE_ENV', 'development'),
      },

      server: {
        port: parseInt(env('METRICS_PORT', '9000'), 10),
        host: '0.0.0.0',
        path: '/metrics',
      },

      normalize: [
        [/\/(?:[a-z0-9]{24,25}|\d+)(?=\/|$)/, '/:id'],
        [/\/uploads\/[^\\/]+\.[a-zA-Z0-9]+/, '/uploads/:file'],
      ],
    },
  },
  'open-forms-embed': {
    enabled: true,
    config: {
      api_url: env('OPEN_FORMS_API_URL'),
      token: env('OPEN_FORMS_API_TOKEN'),
      embed_url: env('FRONTEND_PUBLIC_URL'),
    },
  },
  'old-slugs': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::product.product',
        },
      ],
    },
  },
});
