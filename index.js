const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const Middleware = require("./midleware");
const Database = require("./database");
const Routing = require("./src/client/routing");
const RoutingAdmin = require("./src/admin/routing");
const RoutingSuperAdmin = require("./src/SuperAdmin/routing");
const RoutingPublic = require("./src/public/routing");
// Midleware ====

Middleware({ app, bodyParser, cors, express });
//  end Middleware ====

// Routing ======
Routing(app);
RoutingAdmin(app);
RoutingSuperAdmin(app);
RoutingPublic(app);
// end Routing =====

Database.authenticate()
  .then((res) => {
    try {
      console.log("berhasil terkoneksi dengan database", res);
    } catch (error) {
      console.log(`Something Error ${error.message}`);
    }
  })
  .catch((err) => {
    console.log("err", err);
  });

Database.sync({
  alter: false,
});

const port = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.listen(port, () => {
  console.log(`server sudah jalan di port ${port} ${NODE_ENV}`);
});
