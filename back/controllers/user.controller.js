const db = require("../models");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");
//const Cookies = require('cookies')
const { cookie } = require("express/lib/response");
const { promise } = require("bcrypt/promises");
const { refreshTokens } = require("../models");
const User = db.users;
const RefreshToken = db.refreshTokens;
const Op = db.Sequelize.Op;
const secret = process.env.KEY_SECRET;
const resecret = process.env.KEY_REFRESH;

exports.login = (req, res) => {
  // Validate request
  try {
    // Use the incomeing data
    const { email, password } = req.body;
    // if exists
    if (!(email && password)) {
      res.status(400).send("All input is required");
    } else {
      // Find the user
      Promise.all([
        bcrypt.hash(password, 10),  //nem kell
        User.findOne({ where: { email } })
      ]).then(data => {
        const [encryptedPassword, user] = data;
        if (user === null) { res.status(403).send("Invalid email or password") } else {
          // compare passwords
          bcrypt.compare(password, user.password).then(data => {
            //const result = data;
            //console.log(result);
            //allow user in
            if (data) {
              //if the user dont have any tokens but apperas in our database
              if (!req.headers.cookie) {
                //chek the refresh databes and set a new value
                if (RefreshToken.findByPk(email)) {
                  RefreshToken.destroy({
                    where: { refresh_email: email }
                  });
                }
                var refreshtoken = createRefreshToken(user.email);
                var token = createToken(user.email);
                res.cookie('accessToken', token, { httpOnly: true, overwrite: true });
                res.cookie('refreshToken', refreshtoken, { httpOnly: true });
              }
              res.status(200).send("success");
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
}

// Create and Save a new User
exports.create = (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;
    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    // password encryption existing user check
    Promise.all([
      bcrypt.hash(password, 10),
      User.findOne({ where: { email } })
    ]).then(data => {
      const [encryptedPassword, oldUser] = data;
      //console.log(oldUser);
      if (oldUser != null) {
        return res.status(409).send("User Already Exist. Please Login");
      }
      //create user object
      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: encryptedPassword,
      };
      //create user inside the data base
      User.create(user)
        .then(() => {
          console.log("record created");
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });

      //create refreshtoken values
      var refreshtoken = createRefreshToken(user.email)
      //create accesstoken
      var token = createToken(user.email);
      //set cookies
      res.cookie('accessToken', token, { httpOnly: true, overwrite: true });
      res.cookie('refreshToken', refreshtoken, { httpOnly: true });
      //redirect to login page
      res.redirect(200, "/login");
    }).catch(err => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }

};

// Find a single user with an email
exports.findOne = (req, res) => {
  const email = req.params.email;
  User.findByPk(email)
    .then(data => {
      if (data) {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email
      });
    });
};

/*
exports.index = (req, res) => {
  if (!req.headers.cookie) {
    res.status().send({
      message: "cookies not arrived"
    });
  } else {
   res.status(200).send({
      message: "bent"
    });
    console.log(`${__dirname}/index.html`);
    res.sendFile('/home/attila/Dokumentumok/SafeSave/ATI_MENTÉSE/Egyetem/9.flv/szakdolgozat_node_trys/project5/back/secretpages/index.html');

  }
};
*/
function createToken(email) {
  var newtoken = jwt.sign({ email: email }, secret, { expiresIn: '15m' });
  return newtoken;
};

function createRefreshToken(email) {
  const refreshtoken = jwt.sign({ email: email }, resecret);
  var expirerefresh = Date.now() + 7200000;
  //create refreshtoken object
  const object = {
    refresh_email: email,
    token: refreshtoken,
    expiryDate: expirerefresh,
  }
  //create refreshtoken rekord 
  RefreshToken.create(object).then(data => {
    console.log("refresh record created");
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "create refresh token eroor"
    });
  });
  return refreshtoken;
}

function managerefresh(str) {
  var tokentrim = str.substring(
    str.indexOf("=") + 1,
    str.length,
  );
  //const project = await Project.findOne({ where: { title: 'My Title' } });
  RefreshToken.findOne({ where: { token: tokentrim } }).then(data => {
    if (data) {
      jwt.verify(tokentrim, resecret, (err) => {
        if (err) {
          res.redirect(403, "/login");
        } else {
          return data.email;
        }
      });
    }
  });
}

exports.auth = (req, res, next) => {
  if (!req.headers.cookie) {
    res.redirect(403, "/login");
  } else {
    //console.log(req.headers.cookie);
    var str = req.headers.cookie.split(" ")[0];
    var tokentrim = str.substring(
      str.indexOf("=") + 1,
      str.lastIndexOf(";")
    );
    jwt.verify(tokentrim, secret, (err, data) => {
      if (err) {
        res.clearCookie('accessToken', { path: "/" });
        var str = req.headers.cookie.split(" ")[1];
        const tokentik = createToken(managerefresh(str));
        //console.log(tokentik);

        if (tokentik === null) {
          res.redirect(403, "/login");
        }

        res.cookie('accessToken', tokentik, { httpOnly: true, overwrite: true });
        next();
      } else {

        next();
      }
    });
  }
};