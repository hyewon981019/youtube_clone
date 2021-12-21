const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer"); //파일 저장기
var ffmpeg = require("fluent-ffmpeg");

const { encodeBase64 } = require('bcryptjs');
//=================================
//             Comment
//=================================

const { Comment } = require('../models/Comment'); //모델을 가져옴

router.post('/saveComment', (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if(err) return res.json({success : false, err})

        Comment.find({'_id' : comment._id} ) //코멘트 모델을 가져와 찾음 
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.json({success : false, err})

                return res.status(200).json({success : true, result})
            })
    })

});


router.post('/getComments', (req, res) => {

    Comment.find({"postId" : req.body.videoId})
    .populate('writer')
    .exec((err, comments) => {
        if(err)return res.status(400).send(err)
        res.status(200).json({success : true, comments})
    })

});




module.exports = router;