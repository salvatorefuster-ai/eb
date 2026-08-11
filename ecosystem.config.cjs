module.exports = {
  apps: [
    {
      name: "escort-benidorm",
      script: "server/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      // Lee secretos y REAL_MODE desde .env (dotenv en server/index.js)
      env: {
        NODE_ENV: "production",
        PORT: 3456,
      },
    },
  ],
};
