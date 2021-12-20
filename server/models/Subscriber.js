const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const subScriberSchema = mongoose.Schema({ 
    //컬럼 정의해주기
    userTo : {
        type : Schema.Types.ObjectId,
        ref:'User'
    },

    userFrom : {
        type : Schema.Types.ObjectId,
        ref:'User'
    }

}, {timestemps : true}) 

const Subscriber = mongoose.model('Subscriber', subScriberSchema);

module.exports = { Subscriber }