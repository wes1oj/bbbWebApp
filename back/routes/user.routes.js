
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
  //router.post("/createurl", users.auth, urls.createurl);

  // Join BBB meeting
  //router.post("/join", users.auth, urls.joinurl);

  //Check 
  router.get("/isAdmin", auth.isAdmin)

  // Logout user
  router.get("/logout", auth.logout);

  // Get REToken
  router.get("/ref", auth.authRefresh);

  // Get ACc Token
  router.get("/acc", auth.authAccsess);
  // Nem biztos hogy kelleni fog de azért itt marad
  //router.get("/:id", users.findOne);

  router.get("/moderator", auth.authModerator);
  router.post("/setS", users.setS);


  app.use('/api', router);
};