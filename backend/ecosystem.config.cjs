module.exports = {
  apps: [
    {
      name: "oriyet-backend",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
