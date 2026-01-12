module.exports = {
  apps: [
    {
      name: "oriyet-backend",
      cwd: "/root/oriyet/backend",
      script: "npm",
      args: "start",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
