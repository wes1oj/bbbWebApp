
const db = require("../models");
require('dotenv').config();
const jwte = require('jwt-token-encrypt');
const talan = require('./sha1');
const Meeting = db.meeting;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secret = process.env.KEY_SECRET;
const prKey = process.env.KEY_RECF;

exports.createurl = (req, res) => {
    // Get inputs
    const { basicInfo,
        meetingName,
        attendeePassword,
        moderatorPassword,
        welcomeMessage,
        maxParticipants,
        record,
        duration,
        moderatorOnlyMessage,
        autoStartRecording,
        allowStartStopRecording,
        webcamsOnlyForModerator,
        bannerText,
        muteOnStart,
        allowModsToUnmuteUsers,
        lockSettingsDisableCam,
        lockSettingsDisableMic,
        lockSettingsDisablePrivateChat,
        lockSettingsDisablePublicChat,
        lockSettingsDisableNote,
        lockSettingsLockedLayout,
        guestPolicy,
        meetingKeepEvents,
        endWhenNoModerator,
        endWhenNoModeratorDelayInMinutes,
        meetingLayout,
        learningDashboardEnabled,
        learningDashboardCleanupDelayInMinutes } = req.body;
    var cookie = req.headers.cookie;
    findOutUserIdAndElse(cookie).then((user) => {
        bcrypt.hash(attendeePassword, 10).then((ahpwu) => {
            var ahpw = url_encode(ahpwu);
            bcrypt.hash(moderatorPassword, 10).then((mohpwu) => {
                var mohpw = url_encode(mohpwu);


                Meeting.findOne({ where: { MeetName: meetingName } }).then(data => {
                    // If the meeting not exists in our database
                    if (data == null) {
                        // We can use the default params 
                        if (basicInfo == true) {
                            // Create ID
                            const meetingID = getMeetingID();
                            // Create Params
                            const param = createParam([meetingName,
                                ahpw,
                                mohpw], meetingID);
                            // Create checksum
                            hash = cheksum("create" + param);
                            // Create create meeting url
                            const url = createMeetingURL(param, hash);
                            // Create meeting recrod
                            createMeetingRecord(meetingID, meetingName, mohpw, user.Role, user.Id);
                            // Manual test
                            var text = "{" + "\"url\"" + ":" + "\"" + url + "\"" + "}";
                            // Return
                            res.status(200).send(text);
                            //Response.redirect(url);

                            //res.status(200).send(json);
                        } else { // We can't use the default params
                            // Create ID
                            const meetingID = getMeetingID();
                            // Create Param
                            const param = createOptionalParam([meetingName,
                                ahpw,
                                mohpw,
                                welcomeMessage,
                                maxParticipants,
                                record,
                                duration,
                                moderatorOnlyMessage,
                                autoStartRecording,
                                allowStartStopRecording,
                                webcamsOnlyForModerator,
                                bannerText,
                                muteOnStart,
                                allowModsToUnmuteUsers,
                                lockSettingsDisableCam,
                                lockSettingsDisableMic,
                                lockSettingsDisablePrivateChat,
                                lockSettingsDisablePublicChat,
                                lockSettingsDisableNote,
                                lockSettingsLockedLayout,
                                guestPolicy,
                                meetingKeepEvents,
                                endWhenNoModerator,
                                endWhenNoModeratorDelayInMinutes,
                                meetingLayout,
                                learningDashboardEnabled,
                                learningDashboardCleanupDelayInMinutes], meetingID);
                            // Create cheksum
                            hash = cheksum("create" + param);
                            // Create create meeting url
                            const url = createMeetingURL(param, hash);
                            // Create meeting record
                            createMeetingRecord(meetingID, meetingName, moderatorPassword, Id);
                            // Show the url
                            //console.log(url);
                            var text = "{" + "\"url\"" + ":" + "\"" + url + "\"" + "}";
                            // Return
                            res.status(200).send(text);
                            //Response.redirect(url);
                        }
                    }
                    else {
                        var text = "{" + "\"url\"" + ":" + "\"" + "false" + "\"" + "}";
                        res.status(409).send(text);
                    }
                })
            });
        });
    });
}

function hashpw(a) {
    bcrypt.hash(a, 10).then(data => {
        var ah = data;
        return ah;
    });
}
module.exports.hashpw = hashpw;

async function ExtractUserInfo(a) {
    var c = jwt.verify(a, secret);
    const encryption = {
        key: prKey,
        algorithm: 'aes-256-cbc',
    };
    const d = jwte.readJWT(a, encryption);
    return d;
};
module.exports.ExtractUserInfo = ExtractUserInfo;

async function findOutUserIdAndElse(cookie) {
    var str = cookie.split(" ")[0];
    var tokentrim = str.substring(
        str.indexOf("=") + 1,
        str.lastIndexOf(";")
    );
    let a = await ExtractUserInfo(tokentrim);
    const user = {
        Role: a.data.Role,
        Id: a.data.Id
    }
    return user;

}

// Create meeting
function createMeetingRecord(meetingID, meetingName, moderatorPassword, Id) {
    console.log(Id);
    // Hash the moderator password
    bcrypt.hash(moderatorPassword, 10).then(data => {
        var ps = url_encode(data);
        // Create an object
        const meeting = {
            MeetID: meetingID,
            MeetName: meetingName,
            MeetPW: ps,
            MeetModerID: Id
        };
        // Create meeting record
        Meeting.create(meeting)
            .then(() => {
                console.log("meeting record created");
            })
            .catch(err => {
                console.log(err);
            });
    })
}

// Create Join URL
exports.joinurl = (req, res) => {

    // Get input

    var meetingName = req.body.meetingName;
    var meetingId = req.body.meetingId;
    var fullName = req.body.fullName;
    var password = req.body.password;

    // Check input
    if (meetingName == "" || fullName == "" || password == "") {
        var text = "{" + "\"url\"" + ":" + "\"" + "false" + "\"" + "}";
        res.status(409).send(text);
    }


    bcrypt.hash(password, 10).then((p) => {
        password = url_encode(p);

        // If we have the meeting id, than use it
        if (meetingId) {
            // Find the meeting inside our db
            Meeting.findOne({ where: { MeetID: meetingId } }).then(data => {
                // We dont have it
                if (data == null) {
                    var text = "{" + "\"url\"" + ":" + "\"" + "false" + "\"" + "}";
                    res.status(409).send(text);
                }
                // We find the meeting
                // Create Params
                const param = joinParam(meetingId, [fullName, password]);
                // Create checksum
                const hash = cheksum("join" + param);
                // Create URL
                const url = joinMeetingURL(param, hash);
                // Return
                var text = "{" + "\"url\"" + ":" + "\"" + url + "\"" + "}";
                // Return
                res.status(200).send(text);
                //Response.redirect(url);

            });
        } else { // If the user dont know the meeting id
            // Find the meeting inside our db
            Meeting.findOne({ where: { MeetName: meetingName } }).then(data => {
                if (data == null) {// Meeting doesent exists
                    var text = "{" + "\"url\"" + ":" + "\"" + "false" + "\"" + "}";
                    res.status(409).send(text);
                } else {
                    // Meeting inside our db
                    console.log(data);
                    // Create Join Params
                    const param = joinParam(data.MeetID, [fullName, password]);
                    // Create cheksum
                    const hash = cheksum("join" + param);
                    // Create url
                    joinMeetingURL(param, hash).then((url) => {
                        // Return
                        //res.status(200).send(url)
                        var text = "{" + "\"url\"" + ":" + "\"" + url + "\"" + "}";
                        // Return
                        res.status(200).send(text);
                        //Response.redirect(url);

                    });
                }

            });
        }
    });
}

function url_encode(a) {
    for (let i = 0; i < a.length; i++) {
        a[i] = encodeURI(a[i], "UTF-8");
    }
    return a;
}

function createParam(array, meetingID) {
    var arrayParam = url_encode(array);
    var param = "name=" + arrayParam[0] + "&meetingID=" + meetingID + "&attendeePW=" + arrayParam[1] + "&moderatorPW=" + arrayParam[2];
    return param;
}

function createOptionalParam(array, meetingID) {
    var arrayParam = url_encode(array);
    var param = "name=" + arrayParam[0] + "&meetingID=" + meetingID + "&attendeePW=" + arrayParam[1] + "&moderatorPW=" + arrayParam[2] + "&welcome=" + arrayParam[3] + "&maxParticipants=" + arrayParam[4] + "&record=" + arrayParam[5] + "&duration=" + arrayParam[6] + "&moderatorOnlyMessage=" + arrayParam[7] + "&autoStartRecording=" + arrayParam[8] + "&allowStartStopRecording=" + arrayParam[9] + "&webcamsOnlyForModerator=" + arrayParam[10] + "&bannerText=" + arrayParam[11] +/*"&bannerColor="+arrayParam[9]+*/"&muteOnStart=" + arrayParam[12] + "&allowModsToUnmuteUsers=" + arrayParam[13] + "&lockSettingsDisableCam=" + arrayParam[14] + "&lockSettingsDisableMic=" + arrayParam[15] + "&lockSettingsDisablePrivateChat=" + arrayParam[16] + "&lockSettingsDisablePublicChat=" + arrayParam[17] + "&lockSettingsDisableNote=" + arrayParam[18] + "&lockSettingsLockedLayout=" + arrayParam[19] + "&guestPolicy=" + arrayParam[20] + "&meetingKeepEvents=" + arrayParam[21] + "&endWhenNoModerator=" + arrayParam[22] + "&endWhenNoModeratorDelayInMinutes=" + arrayParam[23] + "&meetingLayout=" + arrayParam[24] + "&learningDashboardEnabled=" + arrayParam[25] + "&learningDashboardCleanupDelayInMinutes=" + arrayParam[26];
    return param;
}

function getMeetingID() {
    var id = cheksum(Date.now());
    return id;
}

function cheksum(param) {
    var call = param + "" + process.env.SALT;
    return talan.hex_sha1(call);
}

function createMeetingURL(param, hash) {
    var call = process.env.ENDPOINT + process.env.CREATEURL + param + "&checksum=" + hash;
    return call;
}

// join
function joinParam(meetingID, array) {
    var arrayParam = url_encode(array);
    var param = "fullName=" + arrayParam[0] + "&meetingID=" + meetingID + "&password=" + arrayParam[1];
    return param;
}

async function joinMeetingURL(param, hash) {
    var call = process.env.ENDPOINT + process.env.JOINURL + param + "&checksum=" + hash;
    return call;
}
module.exports.joinMeetingURL = joinMeetingURL;


