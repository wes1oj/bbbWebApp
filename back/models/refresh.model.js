module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        ReID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ReEmail: {
            type: Sequelize.STRING,
        },
        ReToken: {
            type: Sequelize.STRING(500),
            unique: true
        },
        ReExpiry: {
            type: Sequelize.DATE
        }
    });
    return RefreshToken;
};