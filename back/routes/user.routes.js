
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const urls = require("../controllers/url.controller.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/signUp", users.create);

  // Login
  router.post("/login", users.login);

  // Create BBB url
  router.post("/createurl", users.auth, urls.createurl);

  // Join BBB meeting
  router.post("/join", users.auth, urls.joinurl);

  // Logout user
  router.get("/logout", users.logout);

  // Nem biztos hogy kelleni fog de azért itt marad
  router.get("/:id", users.findOne);

  app.use('/api', router);
};