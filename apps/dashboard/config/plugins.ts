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
});
