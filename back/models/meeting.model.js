module.exports = (sequelize, Sequelize) => {
    const Meeting = sequelize.define("meeting", {
        MeetID: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        MeetName: {
            type: Sequelize.STRING,
            unique: true
        },
        MeetPW: {
            type: Sequelize.STRING
        },
        MeetModerID: {
            type: Sequelize.INTEGER
        }
    });
    return Meeting;
};