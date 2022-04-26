require('dotenv').config();
const jwte = require('jwt-token-encrypt');
const db = require("../models");
const jwt = require('jsonwebtoken');
const User = db.user;
const RefreshToken = db.reToken;
const secret = process.env.KEY_SECRET;
const resecret = process.env.KEY_REFRESH;
const prKey = process.env.KEY_RECF;

// Create AccessToken
async function createToken(email, firsName, lastName, Role, id) {
    const privateData = { Email: email, FirsName: firsName, LastName: lastName, Role };
    const publicData = id;
    const encryption = {
        key: prKey,
        algorithm: 'aes-256-cbc',
    };
    const jwtDetails = {
        secret: secret, // to sign the token
        // Default values that will be automatically applied unless specified.
        // algorithm: 'HS256',
        expiresIn: '15m',
        // notBefore: '0s',
        // Other optional values
        key: 'R6MwsxW7mVSBhsQ3Q3pr',// is used as ISS but can be named iss too
    };
    var a = await jwte.generateJWT(
        jwtDetails,
        publicData,
        encryption,
        privateData
    );
    return a;
};
module.exports.createToken = createToken;

async function createReToken(email) {
    const privateData = { Email: email }
    const publicData = "";
    const encryption = {
        key: prKey,
        algorithm: 'aes-256-cbc',
    };
    const jwtDetails = {
        secret: resecret, // to sign the token
        // Default values that will be automatically applied unless specified.
        // algorithm: 'HS256',
        //expiresIn: '15m',
        // notBefore: '0s',
        // Other optional values
        key: 'R6MwsxW7mVSBhsQ3Q3pr',// is used as ISS but can be named iss too
    };
    var a = await jwte.generateJWT(
        jwtDetails,
        publicData,
        encryption,
        privateData
    );
    var expirerefresh = Date.now() + 7200000;
    // Create rekord
    createRefreshTokenRekord(email, a, expirerefresh);
    return a;
};
module.exports.createReToken = createReToken;

function createRefreshTokenRekord(email, refreshtoken, expirerefresh) {
    // Create refreshtoken object
    const object = {
        ReEmail: email,
        ReToken: refreshtoken,
        ReExpiry: expirerefresh
    }
    // Create refreshtoken rekord 
    RefreshToken.create(object).then(() => {
        console.log("RefreshToken record created");
    }).catch(err => {
        console.log("RefreshToken record CREATE ERROR!");
        console.log(err);
    });
};


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

exports.authAccsess = (req, res) => {
    // Get Cookies
    if (!req.headers.cookie) {
        res.status(403).send("cookies not arrived");
    } else {
        var str = req.headers.cookie.split(" ")[0];
        var tokentrim = str.substring(
            str.indexOf("=") + 1,
            str.lastIndexOf(";")
        );
        jwt.verify(tokentrim, secret, (err) => {
            if (err) {
                res.status(403).send("Invalid AccessToken");
            } else {
                res.status(200).send("OK");
            }
        });
    }
};

exports.authRefresh = (req, res) => {
    // Get Cookies
    if (!req.headers.cookie) {
        res.status(403).send("cookies not arrived");
    } else {
        var str = req.headers.cookie.split(" ")[1];
        var tokentrim = str.substring(
            str.indexOf("=") + 1,
        );
        // ha megvan a retoken bázisba az email nem kell kibontani a retokent
        RefreshToken.findOne({ where: { ReToken: tokentrim } }).then(data => {
            if (data === null) {
                res.status(403).send("Invalid RefreshToken");
            } else {
                var email = data.ReEmail;
                User.findOne({ where: { Email: email } }).then(userInfo => {
                    createToken(userInfo.Email, userInfo.FirsName, userInfo.LastName, userInfo.RoleID, userInfo.ID).then(newtoken => {
                        res.cookie('accessToken', newtoken, { httpOnly: true, overwrite: true });
                        res.send(newtoken);
                    });
                });
            }
        });
    }
};
// Manage logout operation
exports.logout = (req, res) => {
    // Get cookies
    var str = req.headers.cookie;
    // Extract RefreshToken
    var tokentrim = str.substring(
        str.indexOf(";") + 15,
        str.length,
    );
    // Delete RefreshToken record
    RefreshToken.destroy({ where: { ReToken: tokentrim } }).then(() => {
        // Delete Client Cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        // Return OK
        res.status(200).send("deleted");
    });
};

exports.isAdmin = (req, res) => {
    if (!req.headers.cookie) {
        res.status(403).send("cookies not arrived");
    } else {
        var str = req.headers.cookie.split(" ")[0];
        var tokentrim = str.substring(
            str.indexOf("=") + 1,
            str.lastIndexOf(";")
        );
        ExtractUserInfo(tokentrim).then((data) => {
            console.log(data);
            if (data.data.Role == 2) {
                res.status(200).send("OK");
            } else {
                res.status(403).send("Not Allowed")
            }
        });
    }
};

exports.authModerator = (req, res) => {
    if (!req.headers.cookie) {
        res.status(403);
    } else {
        var str = req.headers.cookie.split(" ")[0];
        var tokentrim = str.substring(
            str.indexOf("=") + 1,
            str.lastIndexOf(";")
        );
        ExtractUserInfo(tokentrim).then((data) => {
            console.log(data);
            if (data.data.Role == 3) {
                res.status(200).send("OK");
            } else {
                res.status(403);
            }
        });
    }
};