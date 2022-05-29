
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const urls = require("../controllers/url.controller.js");
  const auth = require("../controllers/auth.controller.js");
  var router = require("express").Router();

  // Exit delete tokens
  router.get("/logout", auth.logout); // returns [200]; 
  // Login
  router.post("/login", users.login); // returns [200,tokens;400;403];
  // Create a new User
  router.post("/signUp", users.create); // returns [200;400;409];
  // Get ACc Token
  router.get("/access", auth.authAccsess); // returns [200;403];
  // Get REToken
  router.get("/refresh", auth.authRefresh); // returns [200,newtoken;403];
  // Create meeting
  router.post("/accessCreate", auth.authAccsessNext, urls.createurl); // returns [403;200,call];
  // Join meeting
  router.post("/accessJoin", auth.authAccsessNext, urls.joinurl); // returns [403;200];
  // Is Admin?
  router.get("/accessAdmin", auth.authAccsessNext, auth.isAdmin); // returns [403;200];
  // Set Admin
  router.post("/accessModeratorSet", auth.authAccsessNext, auth.authModerator, users.setS); // returns [200;403];

  app.use('/server', router);
};