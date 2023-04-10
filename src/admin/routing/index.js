const { url } = require("../../../utils");
const AuthenticationRouter = require("./authentication");
const CategoryRouter = require("./category");
const MerchantRouter = require("./merchant");
const TaskRouter = require("./task");

const { pathRouterAdmin } = url;

const Routing = (app) => {
  app.use(pathRouterAdmin("authentication"), AuthenticationRouter);
  app.use(pathRouterAdmin("category"), CategoryRouter);
  app.use(pathRouterAdmin("merchant"), MerchantRouter);
  app.use(pathRouterAdmin("task"), TaskRouter);
};

module.exports = Routing;
