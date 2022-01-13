
const db = require("../models");
require('dotenv').config();
const talan = require('./sha1');
const Meeting = db.meetings;
const bcrypt = require("bcrypt");

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

    Meeting.findOne({ where: { meetingName: meetingName } }).then(data => {
        // If the meeting not exists in our database
        if (data == null) {
            // We can use the default params 
            if (basicInfo == true) {
                // Create ID
                const meetingID = getMeetingID();
                // Create Params
                const param = createParam([meetingName,
                    attendeePassword,
                    moderatorPassword], meetingID);
                // Create checksum
                hash = cheksum("create" + param);
                // Create create meeting url
                const url = createMeetingURL(param, hash);
                // Create meeting recrod
                createMeetingRecord(meetingID, meetingName, moderatorPassword, attendeePassword);
                // Show the url in commandline
                console.log(url);
                // Return Url
                res.status(200).send(url);
            } else { // We can't use the default params
                // Create ID
                const meetingID = getMeetingID();
                // Create Param
                const param = createOptionalParam([meetingName,
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
                    learningDashboardCleanupDelayInMinutes], meetingID);
                // Create cheksum
                hash = cheksum("create" + param);
                // Create create meeting url
                const url = createMeetingURL(param, hash);
                // Create meeting record
                createMeetingRecord(meetingID, meetingName, moderatorPassword, attendeePassword);
                // Show the url
                console.log(url);
                // Return
                res.status(200).send(url);
            }
        }
        else {
            res.status(409).send("Name alredy exists");
        }
    })
}

// Create meeting
function createMeetingRecord(meetingID, meetingName, moderatorPassword) {
    // Hash the moderator password
    bcrypt.hash(moderatorPassword, 10).then(data => {
        // Create an object
        const meeting = {
            meetingId: meetingID,
            meetingName: meetingName,
            moPassword: data,
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
    const {
        meetingName,
        meetingId,
        fullName,
        password,
    } = req.body;
    // Check input
    if (meetingName == "" || fullName == "" || password == "") {
        res.status(400).send("input fail");
    } else {
        // If we have the meeting id, than use it
        if (meetingId) {
            // Find the meeting inside our db
            Meeting.findOne({ where: { meetingId: meetingId } }).then(data => {
                // We dont have it
                if (data == null) {
                    res.status(409).send("Incorrect meeting ID");
                } else { // We find the meeting
                    // Create Params
                    const param = joinParam(meetingId, [fullName, password]);
                    // Create checksum
                    const hash = cheksum("join" + param);
                    // Create URL
                    const url = joinMeetingURL(param, hash);
                    // Return
                    res.status(200).send(url);
                }
            });
        } else { // If the user dont know the meeting id
            // Find the meeting inside our db
            Meeting.findOne({ where: { meetingName: meetingName } }).then(data => {
                if (data == null) {// Meeting doesent exists
                    res.status(409).send("Incorrect meeting Meeting Name");
                } else { // Meeting inside our db
                    // Create Join Params
                    const param = joinParam(data.meetingId, [fullName, password]);
                    // Create cheksum
                    const hash = cheksum("join" + param);
                    // Create url
                    const url = joinMeetingURL(param, hash);
                    // Return
                    res.status(200).send(url)
                }
            });
        }
    }
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

function joinMeetingURL(param, hash) {
    var call = process.env.ENDPOINT + process.env.JOINURL + param + "&checksum=" + hash;
    return call;
}


