const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel")
const { default: mongoose } = require("mongoose");
const router = express.Router();
// const multer = require('multer');

// router.post("/", async (request, response) => {
  
// });

// var storage = multer.diskStorage({

// })

router.get("/:id", async (request, response) => {
    try {
        const userId = mongoose.Types.ObjectId.isValid(request.params.id) 
            ? new mongoose.Types.ObjectId(request.params.id) 
            : null;
        if(!userId) response.status(400).send("Invalid User ID");

        const user = await User.findById(userId, "_id");
        if(!user) response.status(400).send("Not found User");

        const photos = await Photo.find({user_id : userId}).populate(
            "comments.user_id",
            "_id, first_name, last_name"
        )

        const formatedPhoto = photos.map((photo) => ({
            _id: photo._id,
            user_id: photo.user_id,
            file_name: photo.file_name,
            date_time: photo.date_time,
            comments: (photo.comments || []).map((c) => ({
                comment: c.comment,
                date_time: c.date_time,
                _id: c._id,
                user_id: c.user_id?._id,
                first_name: c.user_id?.first_name,
                last_name: c.user_id?.last_name,
            }))
        }));
        response.json(formatedPhoto);
    } catch(error) {
        response.status(400).send("Error");
    }
});

module.exports = router;
