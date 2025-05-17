const configureUserRouter = require("./contactsRouter.js");
const configureClientRouter = require("./clientsRouter.js");
const configureProjectRouter = require("./projectRouter.js");
const configureNoteRouter = require("./noteRouter.js");

module.exports = {
  configureUserRouter,
  configureClientRouter,
  configureProjectRouter,
  configureNoteRouter
};