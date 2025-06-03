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

module.exports = router;