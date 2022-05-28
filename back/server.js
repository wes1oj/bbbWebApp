const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./models");
const app = express();
const clean = require("./controllers/scheduled.controller");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  runOnce();
});


var corsOptions = {
  origin: "http://localhost:5001"
};

function runOnce() {
  const userRole = db.userRole;
  const user = db.user;
  var User = { Role: "User" };
  var Admin = { Role: "Admin" };
  var Moderator = { Role: "Moderator" };

  userRole.create(User).then(() => {
    console.log("UserRoleAdd");
  });

  userRole.create(Admin).then(() => {
    console.log("AdminRoleAdd");
  });

  userRole.create(Moderator).then(() => {
    console.log("ModeratorRoleAdd");
  });

  var pw = "Moderator";
  bcrypt.hash(pw, 10).then(pwe => {
    const moderator = {
      FirstName: "Moderator",
      LastName: "Moderator",
      Email: "Moderator",
      Pw: pwe,
      roleRoleID: 3
    }
    user.create(moderator).then(() => {
      console.log("ModeratorUser created");
    });
  });
  var pw = "Admin";
  bcrypt.hash(pw, 10).then(pwe => {
    const admin = {
      FirstName: "Admin",
      LastName: "Admin",
      Email: "Admin",
      Pw: pwe,
      roleRoleID: 2
    }
    user.create(admin).then(() => {
      console.log("AdminUser created");
    });
  });
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


require("./routes/user.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
