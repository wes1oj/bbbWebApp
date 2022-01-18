module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        refreshEmail: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        token: {
            type: Sequelize.STRING,
            unique: true
        },
        expiryDate: {
            type: Sequelize.DATE,
        }
    });
    return RefreshToken;
};