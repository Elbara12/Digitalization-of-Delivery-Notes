const express = require("express");
const {configureMiddlewares, configureUserRouter, configureClientRouter, configureProjectRouter, configureNoteRouter} = require("./express");
const setupSwagger = require("./swagger");

async function startWeb() {
  const app = express();

  // Configure middlewares
  configureMiddlewares(app);
  setupSwagger(app);

  // Configure routes
  app.use("/api/user", await configureUserRouter());
  app.use("/api/client", await configureClientRouter());
  app.use("/api/project", await configureProjectRouter());
  app.use("/api/deliverynote", await configureNoteRouter());

  // Start the server
  const server = startServer(app, process.env.PORT || 3000);

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${process.env.PORT} is already in use`);
      startServer(app, 0);
    }
  });
}

function startServer(app, port) {
  const server = app.listen(port, () => {
    console.log(`Server is listening to port ${server.address().port}`);
  });
  return server;
}

module.exports = startWeb;
