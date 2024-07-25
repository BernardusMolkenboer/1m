// knexfile.js
require("dotenv").config(); // Load environment variables

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "W4chtw00rd!23",
    database: process.env.DB_NAME || "million_dollar_homepage",
  },
  pool: { min: 0, max: 7 },
  migrations: {
    directory: "./migrations", // Directory for migrations
    tableName: "knex_migrations", // Table for tracking migrations
  },
  seeds: {
    directory: "./seeds", // Directory for seeds
  },
};
