const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel")
const { default: mongoose } = require("mongoose");
const router = express.Router();
const expressFileUpload = require('express-fileupload');
const fileUpload = require("express-fileupload");
const path = require('path');

// const multer = require('multer');

const imageFolder = path.join(__dirname,'..', "images");

// router.post("/", async (request, response) => {
  
// });

// var storage = multer.diskStorage({

// })

router.use(fileUpload());

router.post("/photos/new", async (request,response) => {
    console.log(request.files);
    const { image } = request.files;
    const { user_id } = request.body;
    const imageName = image.name;
    const comment = [];
    console.log(user_id);
    image.mv(path.join(imageFolder, image.name));
    const newPhoto = new Photo({
        file_name: imageName,
        date_time: new Date(),
        user_id: user_id,
        comments: comment
    });

    await newPhoto.save();
    response.status(200).json({message: "Succesful"});
})

router.post("/commentsOfPhoto/:photo_id", async  (request,response) => {
    try {
        // if(!request.session.user) {
        //     return response.status(400).send("Need Login");
        // }
        const photo_id = request.params.photo_id;
        console.log(photo_id);
        const addComment = {
            comment: request.body.comment,
            date_time: new Date(),
            user_id: request.body.user_id,
            _id: photo_id,
        }
        console.log(addComment);

        const photo = await Photo.findById(photo_id, "_id comments");
        console.log(photo);
        photo.comments.push(addComment);
        const savedComment = await photo.save();
        response.status(200).send({ photo: savedComment});
    } catch (err) {
        response.status(400).send("Error");
    };
})


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
