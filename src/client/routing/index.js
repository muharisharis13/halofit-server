const AuthenticationRouter = require("./authentication");
const BookingRouter = require("./booking");
const featureRouter = require("./feature");
const roomRouter = require("./room");
const userRouter = require("./user");
const facilityRouter = require("./facility");
const categoryRouter = require("./category");
const merchantRouter = require("./merchant");
const taskRouter = require("./task");
const notificationRouter = require("./notifications");
const { url } = require("../../../utils");

const { pathRouterClient } = url;
const Routing = (app) => {
  app.use(pathRouterClient("authentication"), AuthenticationRouter);
  app.use(pathRouterClient("booking"), BookingRouter);
  app.use(pathRouterClient("feature"), featureRouter);
  app.use(pathRouterClient("room"), roomRouter);
  app.use(pathRouterClient("user"), userRouter);
  app.use(pathRouterClient("facility"), facilityRouter);
  app.use(pathRouterClient("category"), categoryRouter);
  app.use(pathRouterClient("merchant"), merchantRouter);
  app.use(pathRouterClient("task"), taskRouter);
  app.use(pathRouterClient("notification"), notificationRouter);
};

module.exports = Routing;
