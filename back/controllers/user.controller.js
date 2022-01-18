const db = require("../models");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = db.users;
const RefreshToken = db.refreshTokens;
const secret = process.env.KEY_SECRET;
const resecret = process.env.KEY_REFRESH;

exports.login = (req, res) => {
  try {
    // Use the incomeing data
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input required!");
    } else {
      // Find the user  
      User.findOne({ where: { email } }).then(data => {
        if (data === null) {
          res.status(403).send("Invalid email or password")
        }
        else {
          // Compare passwords
          bcrypt.compare(password, data.password).then(ps => {
            // Allow user in
            if (ps) {
              // If the user dont have any tokens but apperas in our database
              if (!req.headers.cookie) {
                // If we still have his refreshtoken
                if (RefreshToken.findByPk(email)) {
                  // Than we dont need it.
                  RefreshToken.destroy({
                    where: { refreshEmail: email }
                  });
                }
                // Create new tokens
                var refreshtoken = createRefreshToken(data.email);
                var token = createToken(data.email);
                // Send new tokens
                res.cookie('accessToken', token, { httpOnly: true, overwrite: true });
                res.cookie('refreshToken', refreshtoken, { httpOnly: true });
              }
              // Returns
              res.status(200).send("Success");
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
    const { firstName, lastName, email, password } = req.body;
    // Validate user input
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required");
    }
    // Password encryption, and existing user check
    Promise.all([
      bcrypt.hash(password, 10),
      User.findOne({ where: { email } })
    ]).then(data => {
      const [encryptedPassword, oldUser] = data;
      // If User alredy exists
      if (oldUser != null) {
        return res.status(409).send("User Already Exist. Please Login");
      }
      // Create user object
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: encryptedPassword,
      };
      // Create user inside the database
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

      // Create refreshtoken values
      var refreshtoken = createRefreshToken(user.email)
      // Create accesstoken
      var token = createToken(user.email);
      // Set cookies
      res.cookie('accessToken', token, { httpOnly: true, overwrite: true });
      res.cookie('refreshToken', refreshtoken, { httpOnly: true });
      // Response OK
      res.status(200).send("User created");
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

// Create AccessToken
function createToken(email) {
  var newtoken = jwt.sign({ email: email }, secret, { expiresIn: '15m' });
  return newtoken;
};

// Create RefreshToken and RefreshToken rekord
function createRefreshToken(email) {
  // Create refreshtoken
  const refreshtoken = jwt.sign({ email: email }, resecret);
  // Set expiredate
  var expirerefresh = Date.now() + 7200000;
  // Create refreshtoken object
  const object = {
    refreshEmail: email,
    token: refreshtoken,
    expiryDate: expirerefresh,
  }
  // Create refreshtoken rekord 
  RefreshToken.create(object).then(data => {
    console.log("RefreshToken record created");
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "RefreshToken create Error"
    });
  });
  // Return Token
  return refreshtoken;
}

// Manage authentication
exports.auth = (req, res, next) => {
  // Get Cookies
  if (!req.headers.cookie) {
    res.status(403).send("You should login first");
  } else {
    // Extract AccessToken
    var str = req.headers.cookie.split(" ")[0];
    var tokentrim = str.substring(
      str.indexOf("=") + 1,
      str.lastIndexOf(";")
    );
    // Verify AccessToken
    jwt.verify(tokentrim, secret, (err) => {
      // Wrong AccessToken
      if (err) {
        // Delete AccessToken
        res.clearCookie('accessToken', { path: "/" });
        // Extract RefreshToken
        var str = req.headers.cookie.split(" ")[1];
        // Check RefreshToken Email
        const extractedEmail = managerefresh(str);
        // Check value
        if (extractedEmail === null) {
          // Denial Operation
          res.status(403).send("You should login first")
        } else {
          // Create new AccessToken
          const tokentik = createToken(extractedEmail);
          // Send AccessToken
          res.cookie('accessToken', tokentik, { httpOnly: true, overwrite: true });
          next();
        }
      } else {
        // AccessToken still valide
        next();
      }
    });
  }
};

function managerefresh(str) {
  // Extract Token
  var tokentrim = str.substring(
    str.indexOf("=") + 1,
    str.length,
  );
  // Do we still have the RefreshToken
  RefreshToken.findOne({ where: { token: tokentrim } }).then(data => {
    if (data) {
      // Verify the token
      jwt.verify(tokentrim, resecret, (err) => {
        if (err) {
          // RefreshToken not valid
          return null;
        } else {
          // Return RefreshToken Email
          return data.refreshEmail;
        }
      });
    } else {
      // We dont have it in our db
      return null;
    }
  });
}

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
  RefreshToken.destroy({ where: { token: tokentrim } }).then(() => {
    // Delete Client Cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    // Return OK
    res.status(200).send("deleted");
  });
};