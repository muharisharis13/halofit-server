const AuthenticationRouter = require("./authentication");
const { url } = require("../../../utils");

const { pathRouterClient } = url;
const Routing = (app) => {
  app.use(pathRouterClient("authentication"), AuthenticationRouter);
};

module.exports = Routing;
