var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jg');
const conn = mongoose.connection
conn.on('connected', function () {
    console.log('数据库连接成功!')
})

const userSchema = mongoose.Schema({
    phoneNum:{type:String,required:true},
    password:{type:String,required:true},
    swiperData : [{
        userName:String,
        userPhone:String,
        region:String,
        detailAddress:String,
        defaultAddress:Boolean
    }]
})

const UserModel = mongoose.model("user",userSchema);
module.exports = {
    getModel(name) {
        return mongoose.model("user")
    }
}

