const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { authenticator } = require("./authenticator");
const requestLogger = require("./loggerMiddlewares");
const requestWrapper = require("./requestWrapper");
const { errorHandler } = require("./errorHandler");

function configureMiddlewares(app) {
  app.use(express.static(path.resolve(__dirname, "../public")));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(requestWrapper);
  app.use(requestLogger);
  app.use(authenticator);
  app.use(errorHandler);
}

module.exports = configureMiddlewares;
