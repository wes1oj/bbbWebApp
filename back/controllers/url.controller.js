
const db = require("../models");
require('dotenv').config();
const talan = require('./sha1');
const Meeting = db.meetings;
const bcrypt = require("bcrypt");

exports.createurl = (req, res) => {

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

    if (basicInfo != undefined) {
        Meeting.findOne({ where: { meetingName: meetingName } }).then(data => {
            console.log(data + "data");
            //console.log(meetingName + "meetingName");
            //console.log(data.meetingName + "data.meetingName");
            if (data === undefined || data == null) {
                if (basicInfo == undefined) { console.log(basicInfo + "should be undefined"); }
                else if (basicInfo == true) {
                    console.log(basicInfo + "should be true");
                    const meetingID = getMeetingID();
                    const param = createParam([meetingName,
                        attendeePassword,
                        moderatorPassword], meetingID);
                    hash = cheksum("create" + param);
                    const url = createMeetingURL(param, hash);
                    createMeetingRecord(meetingID, meetingName, moderatorPassword, attendeePassword);
                    console.log(url);
                    res.status(200).send(url);
                } else {
                    console.log(basicInfo + "should be false");
                    const meetingID = getMeetingID();
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
                    hash = cheksum("create" + param);
                    const url = createMeetingURL(param, hash);
                    createMeetingRecord(meetingID, meetingName, moderatorPassword, attendeePassword);
                    console.log(url);
                    res.status(200).send(url);
                }
            }
            else {
                res.status(409).send("Name alredy exists");
            }
        })
    }
}



function createMeetingRecord(meetingID, meetingName, moderatorPassword, attendeePassword) {
    Promise.all([
        bcrypt.hash(moderatorPassword, 10),  //nem kell
        bcrypt.hash(attendeePassword, 10),]).then(data => {
            const [mop, atp] = data;
            const meeting = {
                meetingId: meetingID,
                meetingName: meetingName,
                moPassword: mop,
                atPassword: atp
            };
            //create user inside the data base
            Meeting.create(meeting)
                .then(() => {
                    console.log("meeting record created");
                })
                .catch(err => {
                    console.log(err);
                });
        })
}

exports.joinurl = (req, res) => {
    const {
        meetingName,
        meetingId,
        fullName,
        password,
    } = req.body;
    if (meetingName == "" || fullName == "" || password == "" || meetingName === undefined || fullName === undefined || password === undefined) {
        res.status(500);
    } else {
        if (meetingId) {
            Meeting.findOne({ where: { meetingId: meetingId } }).then(data => {
                if (data === undefined || data == null) {
                    res.status(409).send("Incorrect meeting ID");
                } else {

                    const param = joinParam(meetingId, [fullName, password]);
                    const hash = cheksum("join" + param);
                    const url = joinMeetingURL(param, hash);
                    res.status(200).send(url)

                }
            });
        } else {
            Meeting.findOne({ where: { meetingName: meetingName } }).then(data => {
                if (data === undefined || data == null) {
                    res.status(409).send("Incorrect meeting Meeting Name");
                } else {

                    const param = joinParam(data.meetingId, [fullName, password]);
                    const hash = cheksum("join" + param);
                    const url = joinMeetingURL(param, hash);
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


