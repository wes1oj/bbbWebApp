const db = require("../models");
const { Op } = require("sequelize");
function cleanup() {
    cleanupRetokens();
    cleanupMeetings();
    console.log("Scheduled tasks starts");
}

function cleanupRetokens() {
    try {
        var reToken = db.reToken;
        reToken.destroy({
            where: {
                ReExpiry: {
                    [Op.lte]: Date.now()
                }
            }
        });
    } catch (err) {
        console.log("Error in retoken destroy: " + err);
        return null;
    }
}

function cleanupMeetings() {
    try {
        var meeting = db.meeting;
        meeting.destroy({
            where: {
                createdAt: {
                    [Op.lte]: Date.now() - 21600000 //6h
                }
            }
        });
    } catch (err) {
        console.log("Error in meeting destroy: " + err);
        return null;
    }
}

setInterval(function () { cleanup() }, 21600000);  //3.5h