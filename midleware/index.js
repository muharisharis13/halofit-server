const { url } = require("../utils");
const expressip = require("express-ip");

const { pathBanner } = url;

const Middleware = ({ app, bodyParser, cors, express }) => {
  app.use(cors());

  app.options("*", cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(expressip().getIpInfoMiddleware);

  // file static upload

  app.use(pathBanner, express.static("./uploads/banner"));
};

module.exports = Middleware;
