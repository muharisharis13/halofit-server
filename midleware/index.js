const { url } = require("../utils");
const expressip = require("express-ip");
var cron = require("node-cron");
const deleteRoom = require("../modules/deleteRoomExp");
const { pathBannerTask, pathProfile } = require("../utils/url");

const { pathBanner } = url;

const Middleware = ({ app, bodyParser, cors, express }) => {
  app.use(cors());

  app.options("*", cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(expressip().getIpInfoMiddleware);

  // file static upload

  app.use(pathBanner, express.static("./uploads/banner"));
  app.use(pathBannerTask, express.static("./uploads/task"));
  app.use(pathProfile, express.static("./uploads/profileUser"));

  cron.schedule("* * * * *", () => {
    console.log("running a task every minute");
    deleteRoom();
  });
};

module.exports = Middleware;
