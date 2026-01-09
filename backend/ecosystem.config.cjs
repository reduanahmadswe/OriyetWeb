module.exports = {
  apps: [
    {
      name: "oriyet-backend-dev",
      cwd: "/root/oriyet/backend",
      script: "npm",
      args: "run dev",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
