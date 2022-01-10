
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const urls = require("../controllers/url.controller.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/singUp", users.create);

  // Login
  router.post("/login", users.login);

  // Create BBB url
  router.post("/createurl", users.auth, urls.createurl);

  router.post("/join", users.auth, urls.joinurl);

  // Retrieve a single Tutorial with id
  router.get("/:id", users.findOne);

  app.use('/', router);
};