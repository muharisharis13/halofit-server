const { url } = require("../../../utils");
const AuthenticationRouter = require("./authentication");
const UserRouter = require("./user");
const MerchantRouter = require("./merchant");
const taskRouter = require("./task");
const bookingRouter = require("./booking");
const roomRouter = require("./Meetup");
const messageRouter = require("./messages");
const sendEmailRouter = require("./email");
const promoRouter = require("./promo");
const adminRouter = require("./admin");

const { pathRouterSuperAdmin } = url;

const Routing = (app) => {
  app.use(pathRouterSuperAdmin("authentication"), AuthenticationRouter);
  app.use(pathRouterSuperAdmin("user"), UserRouter);
  app.use(pathRouterSuperAdmin("merchant"), MerchantRouter);
  app.use(pathRouterSuperAdmin("task"), taskRouter);
  app.use(pathRouterSuperAdmin("booking"), bookingRouter);
  app.use(pathRouterSuperAdmin("room"), roomRouter);
  app.use(pathRouterSuperAdmin("message"), messageRouter);
  app.use(pathRouterSuperAdmin("email"), sendEmailRouter);
  app.use(pathRouterSuperAdmin("promo"), promoRouter);
  app.use(pathRouterSuperAdmin("admin"), adminRouter);
};

module.exports = Routing;
