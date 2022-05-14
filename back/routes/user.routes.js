
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const urls = require("../controllers/url.controller.js");
  const auth = require("../controllers/auth.controller.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/signUp", users.create);

  // Login
  router.post("/login", users.login);

  // Create BBB url
  router.post("/createurl", urls.createurl);

  // Join BBB meeting
  router.post("/join", urls.joinurl);

  //Check 
  router.get("/isAdmin", auth.isAdmin)

  // Logout user
  router.get("/logout", auth.logout);

  // Get REToken
  router.get("/ref", auth.authRefresh);

  // Get ACc Token
  router.get("/acc", auth.authAccsess);

  router.get("/moderator", auth.authModerator);
  router.post("/set", users.setS);


  app.use('/server', router);
};