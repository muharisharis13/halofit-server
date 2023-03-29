const { url } = require("../utils");

const { pathBanner } = url;

const Middleware = ({ app, bodyParser, cors, express }) => {
  app.use(cors());
  app.options("*", cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // file static upload

  app.use(pathBanner, express.static("./uploads/banner"));
};

module.exports = Middleware;
