const { url } = require("../../../utils");
const AuthenticationRouter = require("./authentication");
const CategoryRouter = require("./category");
const MerchantRouter = require("./merchant");
const TaskRouter = require("./task");
const facilityRouter = require("./facility");
const featureRouter = require("./feature");

const { pathRouterAdmin } = url;

const Routing = (app) => {
  app.use(pathRouterAdmin("authentication"), AuthenticationRouter);
  app.use(pathRouterAdmin("category"), CategoryRouter);
  app.use(pathRouterAdmin("merchant"), MerchantRouter);
  app.use(pathRouterAdmin("task"), TaskRouter);
  app.use(pathRouterAdmin("facility"), facilityRouter);
  app.use(pathRouterAdmin("feature"), featureRouter);
};

module.exports = Routing;
