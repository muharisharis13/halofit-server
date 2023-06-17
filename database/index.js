const { Sequelize } = require("sequelize");

// const DB_NAME = "epiz_34296880_helofit";
// const DB_USER = "epiz_34296880";
// const DB_PASS = "kN3hr0oxiExMvNu";
// const DB_HOST = "sql302.epizy.com";
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

console.log({ DB_HOST });

const Database = () => {
  return new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "mysql",

    dialectOptions: {
      // useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: "+07:00",
    },
    timezone: "+07:00",
  });
};

module.exports = Database();
