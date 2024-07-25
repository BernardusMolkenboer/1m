const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "W4chtw00rd!23", // Your MySQL password
  database: "million_dollar_homepage",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
