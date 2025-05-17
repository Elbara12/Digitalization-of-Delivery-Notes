const configureMiddlewares = require("./middlewares");
const {
  configureUserRouter,
  configureClientRouter,
  configureProjectRouter,
  configureNoteRouter
} = require("./routes");

module.exports = {
  configureMiddlewares,
  configureUserRouter,
  configureClientRouter,
  configureProjectRouter,
  configureNoteRouter
};