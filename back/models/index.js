const dbConfig = require("../configs/dbconfig");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  password: dbConfig.password,

  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  timezone: "+02:00"
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.userRole = require("./userRole.model")(sequelize, Sequelize);
db.userRole.hasMany(db.user);
db.reToken = require("./refresh.model")(sequelize, Sequelize);
db.meeting = require("./meeting.model")(sequelize, Sequelize);

module.exports = db;
