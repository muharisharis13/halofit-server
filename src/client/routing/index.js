const AuthenticationRouter = require("./authentication");
const BookingRouter = require("./booking");
const featureRouter = require("./feature");
const roomRouter = require("./room");
const userRouter = require("./user");
const facilityRouter = require("./facility");
const { url } = require("../../../utils");

const { pathRouterClient } = url;
const Routing = (app) => {
  app.use(pathRouterClient("authentication"), AuthenticationRouter);
  app.use(pathRouterClient("booking"), BookingRouter);
  app.use(pathRouterClient("feature"), featureRouter);
  app.use(pathRouterClient("room"), roomRouter);
  app.use(pathRouterClient("user"), userRouter);
  app.use(pathRouterClient("facility"), facilityRouter);
};

module.exports = Routing;
