module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    FirstName: {
      type: Sequelize.STRING
    },
    LastName: {
      type: Sequelize.STRING
    },
    Email: {
      type: Sequelize.STRING,
      unique: true
    },
    Pw: {
      type: Sequelize.STRING
    }
  });
  return User;
};