const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const commentSchema = mongoose.Schema({ 
    //컬럼 정의해주기

    writer : {
        type : Schema.Types.ObjectId,
        ref:'User'
    },

    postId : {
        type : Schema.Types.ObjectId,
        ref:'Video'
    },

    responseTo : {
        type : Schema.Types.ObjectId,
        ref:'User'
    },

    content : {
        type : String
    }
  

}, {timestemps : true}) 

const Comment = mongoose.model('Comment', commentSchema );

module.exports = { Comment }