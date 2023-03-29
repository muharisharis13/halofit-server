const { url } = require("../../../utils");
const AuthenticationRouter = require("./authentication");
const CategoryRouter = require("./category");
const MerchantRouter = require("./merchant");

const { pathRouterAdmin } = url;

const Routing = (app) => {
  app.use(pathRouterAdmin("authentication"), AuthenticationRouter);
  app.use(pathRouterAdmin("category"), CategoryRouter);
  app.use(pathRouterAdmin("merchant"), MerchantRouter);
};

module.exports = Routing;
