var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
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
let data = [
    {
        userName:"1",
        userPhone:"1",
        region:"1",
        detailAddress:"1",
        defaultAddress:false

    },
    {
        userName:"2",
        userPhone:"2",
        region:"2",
        detailAddress:"2",
        defaultAddress:false
    }
]
function userSave(){
    let user1 = new UserModel({phoneNum:"123",password:"789",swiperData:data});
    user1.save(function (err,user) {
        console.log("save()",err,user);
    })

}
userSave();
UserModel.findOne({username:"123"},function (err,user) {
    if(user){
        console.log(user);
    }
})
