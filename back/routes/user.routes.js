
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const urls = require("../controllers/url.controller.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/singUp", users.create);

  //!?
  router.post("/login", users.login);

  router.get("/dashboard", users.auth, users.index);

  router.post("/createurl", users.auth, urls.createurl);

  // Retrieve all Tutorials
  //router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  //router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", users.findOne);

  app.use('/', router);
};