module.exports = {
  apps: [
    {
      name: "oriyet-frontend",
      cwd: "/root/oriyet/frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
