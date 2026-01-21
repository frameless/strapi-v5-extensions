export default ({ env }) => ({
  prometheus: {
    enabled: true,
    config: {
      collectDefaultMetrics: false,

      labels: {
        app: "strapi-v5-sandbox",
        environment: env("NODE_ENV", "development"),
      },

      server: {
        port: parseInt(env("METRICS_PORT", "9000")),
        host: "0.0.0.0",
        path: "/metrics",
      },

      normalize: [
        [/\/(?:[a-z0-9]{24,25}|\d+)(?=\/|$)/, "/:id"],
        [/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, "/uploads/:file"],
      ],
    },
  },
});
