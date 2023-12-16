const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});//connect to the database ,details in .env files


// Handling errors during the creation of the connection pool
pool.getConnection()
  .then((connection) => {
    console.log('MySQL Connection Pool Created Successfully');
    connection.release();
  })
  .catch((error) => {
    console.error('Error creating MySQL Connection Pool:', error);
  });

module.exports = pool;
