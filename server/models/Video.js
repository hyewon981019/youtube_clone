const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const videoSchema = mongoose.Schema({ 
    //컬럼 정의해주기
    writer : {
        type : Schema.Types.ObjectId, //쓰는 사람의 아이디 
        ref: 'User' //유저모델에 가서 정보를 긁어옴
    },

    title : {
        type:String,
        maxLength : 50
    },
    description : {
        type: String
    },

    privacy : {
        type : Number
    },

    filePath : {
        type : String
    },

    category : {
        type : String
    },

    views : {
        type : Number,
        default : 0
    },

    duration : {
        type : String
    },

    thumbnail : {
        type : String
    }

}, {timestemps : true}) 

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }