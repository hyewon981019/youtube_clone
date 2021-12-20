const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer"); //파일 저장기
var ffmpeg = require("fluent-ffmpeg");

const { encodeBase64 } = require('bcryptjs');
//=================================
//             Subscribe
//=================================

const { Subscriber } = require('../models/Subscriber'); //모델을 가져옴

router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({'userTo' : req.body.userTo})
    .exec((err, subscribe) => { //쿼리 실행
        if(err) return res.status(400).send(err);

        return res.status(200).json({success : true, subscribeNumber : subscribe.length}) //구독한 사람 수
    })
   
});


router.post('/subscribed', (req, res) => {

    Subscriber.find({'userTo' : req.body.userTo, 'userFrom' : req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false
        if(subscribe.length !==0) //구독하면 1
        {
            result = true;
        }

        return res.status(200).json({success : true, subscribed : result}) //구독 여부

    })
   
});

router.post('/unSubscribe', (req, res) => {

    Subscriber.findOneAndDelete({userTo : req.body.userTo, userFrom : req.body.userFrom})
    .exec((err, doc) =>
    {
        if(err)
        {
            return res.status(400).json({success: false, err});
        }

        res.status(200).json({success : true, doc});
    })
   
});

router.post('/subscribe', (req, res) => {

    const subscribe = new Subscriber(req.body)
    subscribe.save((err, doc) => {
        if(err) return res.json({success : false, err})
        res.status(200).json({success : true})
    })

});



module.exports = router;