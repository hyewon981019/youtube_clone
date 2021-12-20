const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer"); //파일 저장기
var ffmpeg = require("fluent-ffmpeg");

const { encodeBase64 } = require('bcryptjs');
//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    destination : (req, file, cb) => { //파일 저장 경로
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }

    // fileFilter: (req, file, cb) => {
    //     const ext = path.extname(file.originalname)
    //     if(ext !== '.mp4')
    //     {
    //         return cb(res.status(400).end('only mp4 is allowed'), false);
    //     }

    //     cb(null, true);
    // }
});

const fileFilter = (req, file, cb) => { //mp4만 가능하게
    if(file.mimetype == 'video/mp4')
    {
        cb(null, true);
    }

    else{
        cb({msg:'mp4 파일만 업로드 가능'}, false);
    }
}



const upload = multer({storage : storage, fileFilter: fileFilter}).single("file"); //파일 하나만 변수에 넣음

router.post('/uploadfiles', (req, res) => {
    //받은 비디오를 서버에 저장
    upload(req, res, err => {
        if(err)
        {
            return res.json({success : false, err})
        }

        console.log(res.req.file.path);
        return res.json({success: true, url: res.req.file.path, fileName : res.req.file.filename})
    })

})


router.get('/getVideos', (req, res) => {
    
    //비디오를 DB에서 가져와서 클라이언트에 보냄
    Video.find()
        .populate('writer') //writer의 모든 정보 가져옴
        .exec((err, videos)=> {
            if(err) return res.status(400).send(err);
            res.status(200).json({success : true, videos})
        })
    

})


router.post('/getVideoDetail', (req, res) => {
    
    Video.findOne({ "_id" : req.body.videoId}) //아이디를 이용해 비디오를 찾음
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({success : true, videoDetail})
        })

})

router.post('/thumbnail', (req, res) => {

    //썸네일 생성하고 비디오 러닝타임도 가져오기

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){ //ffprobe로 metadata들 가져오기
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });


    //썸네일 생성
    ffmpeg(req.body.url) //클라이언트가 준 비디오 url
    .on('filenames', function(filenames) { //비디오 썸네일 이름 생성
        console.log('Will generate ' + filenames.join(', '));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({success : true, url : filePath, fileDuration : fileDuration})
    })
    .on('error', function(err)
    {
        console.error(err);
        return res.json({success : false, err});
    })
    .screenshots({
        count : 3, //세개의 썸네일 
        folder : 'uploads/thumbnails',
        size : '320x240',
        filename : 'thumbnail-%b.png'
    })

  
})

router.post('/uploadVideo', (req, res) => {
    
    //비디오 정보들을 저장한다

    const video = new Video(req.body) //새 객체로 만들어 정보 저장

    video.save((err, doc)=> { //몽고디비에 저장 
        if(err) {
            return res.json({success : false, err})
        }
        res.status(200).json({success : true})
    }) 

})

module.exports = router;