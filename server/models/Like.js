const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const likeSchema = mongoose.Schema({ 
    //컬럼 정의해주기
 

}, {timestemps : true}) 

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }