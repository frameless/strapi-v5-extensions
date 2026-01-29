export default ({ env }) => ({
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
        [/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, '/uploads/:file'],
      ],
    },
  },
});
