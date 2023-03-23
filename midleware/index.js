const Middleware = ({ app, bodyParser, cors, express }) => {
  app.use(cors());
  app.options("*", cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // file static upload
};

module.exports = Middleware;
