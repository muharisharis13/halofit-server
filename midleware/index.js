const { url } = require("../utils");
const expressip = require("express-ip");

const { pathBanner } = url;

const Middleware = ({ app, bodyParser, cors, express }) => {
  // app.use(cors());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, PATCH, POST, DELETE, PUT, OPTIONS"
    );
    next();
  });
  app.options("*", cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(expressip().getIpInfoMiddleware);

  // file static upload

  app.use(pathBanner, express.static("./uploads/banner"));
};

module.exports = Middleware;
