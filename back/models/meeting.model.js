module.exports = (sequelize, Sequelize) => {
    const Meeting = sequelize.define("meeting", {
        meetingId: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        meetingName: {
            type: Sequelize.STRING
        },
        moPassword: {
            type: Sequelize.STRING
        }
    });
    return Meeting;
};