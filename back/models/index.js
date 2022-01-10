const dbConfig = require("../configs/dbconfig");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model")(sequelize, Sequelize);
db.refreshTokens = require("./refresh.model")(sequelize, Sequelize);
db.meetings = require("./meeting.model")(sequelize, Sequelize);
/*
never worked
db.refreshTokens.belongsTo(db.users, {
  foreignKey: 'user_id', targetKey: 'id'
});
db.users.hasOne(db.refreshTokens, {
  foreignKey: 'user_id', targetKey: 'id'
});
*/
module.exports = db;
