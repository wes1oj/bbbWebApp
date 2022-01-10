

require('dotenv').config();
const talan = require('./sha1');

exports.createurl = (req, res) => {
    const flag = req.body.basicInfo;

    if (flag == "true") {
        const { basicInfo,
            meetingName,
            attendeePassword,
            moderatorPassword } = req.body;
        const meetingID = getMeetingID();
        const param = createParam([meetingName,
            attendeePassword,
            moderatorPassword], meetingID);
        hash = cheksum("create" + param);
        const url = createMeetingURL(param, hash);
        console.log(url);
        res.status(200).send(url);
    } else {
        console.log(flag);
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
        console.log("extended");
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
        console.log(req.body);
        hash = cheksum("create" + param);
        const url = createMeetingURL(param, hash);
        console.log(url);
        res.status(200).send(url);
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

