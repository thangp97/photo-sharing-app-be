const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (request, response) => {
  try {
    const list = await User.find({},"_id first_name last_name");
    response.json(list);
  } catch (error) {
    console.error(error);
    response.status(500).send("Server error");
  }
});

router.get("/:id", async (request, response) => {
  try {
    const getId = await User.findById(request.params.id,
        "_id, first_name last_name location description occupation");
    if(!getId) response.status(400).send("Not Found");
    response.json(getId);
  } catch (error) {
    response.status(400).send("Server error");
  }
});

router.post("/admin/login", async (request, response) => {
  const creds = {
    users: request.body.login_name
  }

  try {
    const user = await User.findOne({
      login_name: creds.users,
    })

    if(user) {
      request.session.user = user;
      console.log(request.session.user);
      response.json(user);
      // response.status(200).send({ message: "Login Success" });
    }
    else {
      response.status(400).send({ message: "Login failed" });
    }
  } catch (err) {
    response.status(400).send({ message: "Server error" });
  }
})

router.post("/admin/logout", async (request, response) => {
  response.json({ message: "Logout Success" });
})

module.exports = router;