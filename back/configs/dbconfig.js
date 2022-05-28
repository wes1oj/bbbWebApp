require('dotenv').config();

// DB connection configuration
module.exports = {
  HOST: process.env.HOST,
  USER: process.env.US,
  PASSWORD: process.env.PW,
  DB: process.env.DB,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

