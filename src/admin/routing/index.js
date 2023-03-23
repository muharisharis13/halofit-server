const { url } = require("../../../utils");
const AuthenticationRouter = require("./authentication");

const { pathRouterAdmin } = url;

const Routing = (app) => {
  app.use(pathRouterAdmin("authentication"), AuthenticationRouter);
};

module.exports = Routing;
