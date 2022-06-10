const db = require("../models");
const bcrypt = require("bcrypt");
require('dotenv').config();
const auth = require("./auth.controller");
const User = db.user;
const ReToken = db.reToken;
const jwt = require('jsonwebtoken');
const secret = process.env.KEY_SECRET;
const prKey = process.env.KEY_RECF;
const jwte = require('jwt-token-encrypt');

exports.login = (req, res) => {
  try {
    // Use the incomeing data
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input required!");
    } else {
      // Find the user  
      User.findOne({ where: { Email: email } }).then(data => {
        if (data === null) {
          res.status(403).send("Invalid email or password")
        }
        else {
          // Compare passwords
          bcrypt.compare(password, data.Pw).then(ps => {
            // Allow user in
            if (ps) {

              // If we still have his refreshtoken
              if (ReToken.findOne({ where: { ReEmail: email } })) {
                // Than we dont need it.
                ReToken.destroy({
                  where: { ReEmail: email }
                });
              }
              // Create new tokens
              auth.createToken(email, data.FirstName, data.LastName, data.roleRoleID, data.ID).then(a => {
                var token = a;
                auth.createReToken(email).then(b => {
                  var Retoken = b;
                  res.cookie('accessToken', token, { httpOnly: true, overwrite: true });
                  res.cookie('refreshToken', Retoken, { httpOnly: true });
                  res.status(200).send("Success");
                });
              });
            } else {
              res.status(400).send("Invalid Credentials");
            }
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create and Save a new User
exports.create = (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { firstName, lastName, email, password } = req.body;
    // Validate user input
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required");
    } else {
      User.findOne({ where: { Email: email } }).then(data => {
        if (!data) {
          createUserRekord(password, email, firstName, lastName);
          res.status(200).send("User created");
        } else {
          res.status(409).send("User Already Exist. Please Login");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

function createUserRekord(password, email, firstName, lastName) {
  bcrypt.hash(password, 10).then(data => {
    const encryptedPassword = data;
    const user = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Pw: encryptedPassword,
      roleRoleID: 1
    };
    // Create user inside the database
    User.create(user)
      .then(() => {
        console.log("User Record created");
      })
      .catch(err => {
        console.log(err + "User DB error")
      });
  });
};

exports.setS = (req, res) => {
  const ID = req.body;
  if (!req.headers.cookie) {
    res.status(403);
  } else {
    var str = req.headers.cookie.split(" ")[0];
    var tokentrim = str.substring(
      str.indexOf("=") + 1,
      str.lastIndexOf(";")
    );
    ExtractUserInfo(tokentrim).then((data) => {
      if (data.data.Role == 3) {
        User.findOne({ where: { ID: ID.ID } }).then(Userdata => {
          if (Userdata === null) {
            res.status(403).send("Invalid");
          } else {
            Userdata.roleRoleID = 2;
            User.update({ roleRoleID: 2 }, { where: { ID: ID.ID } }).then(() => {
              res.status(200).send("OK");
            });
          }
        });
      } else {
        res.status(403);
      }
    });
  }
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