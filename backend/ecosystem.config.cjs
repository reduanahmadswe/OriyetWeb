module.exports = {
  apps: [
    {
      name: "oriyet-backend",
      cwd: "/root/oriyet/backend",
      script: "npm",
      args: "run dev",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
