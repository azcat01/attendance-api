const environment = process.env.ENVIRONMENT || "development";
const config = require("../configs/db.config")[environment];
const knex = require("knex")

module.exports = knex(config);