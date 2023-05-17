const { url } = require("../../../utils");
const messageRouter = require("./messages");

const { pathRouterPublic } = url;

const Routing = (app) => {
  app.use(pathRouterPublic("message"), messageRouter);
};

module.exports = Routing;
