module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        RoleID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Role: {
            type: Sequelize.STRING
        }
    });
    return Role;
};