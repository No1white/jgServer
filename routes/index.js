
var express = require('express');
var router = express.Router();

// import {UserModel} from '../db/models'
const models  = require('../db/models');
const UserModel = models.getModel('user');
const sms_utils = require('../utils/sms_util');
const users = {};
const useNum = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('start')
  res.render('index', { title: 'Express' });
});

//处理首页加载信息
router.get('/album',function (req,res) {
  const banners = require('../data/banners');
  const album = require('../data/goodsInfo');
  const comGoods = require('../data/comGoods');
  let goodsInfo=[];
  let goodsLength = comGoods.length-1>10 ? 10:comGoods.length-1;
  for(let i =0;i<goodsLength;i++){
    goodsInfo.push(comGoods[i]);
  }
  setTimeout(function () {
    res.send({code:0,banners,album,goodsInfo});
  },2000);

})

//
router.get('/goods_info',function (req,res) {
  const data = require('../data/goodsInfo');
  setTimeout(function () {
    res.send({code:0,data});
  },2000);
})

//处理注册请求
router.post('/register',function (req,res) {
  const phoneNum = req.body.phoneNum;
  const password = req.body.password;
  const vefCode = req.body.vefCode;

  if( vefCode != users[phoneNum]) {
    res.send({code:1,msg:"验证码错误"});
    return;
  }
  UserModel.findOne({phoneNum},function (err,user) {
    if(user){
      res.send({code:1,msg:"用户已经存在"});
      return;
    }else {
      let userModel = new UserModel({phoneNum,password})
      userModel.save(function (err,user) {
        if(user){


          res.send({code: 0, data: {_id: user._id, phoneNum: user.phoneNum, password:user.password}})
          return;
        }
      })
    }
  })

})

//发送验证码
router.get('/getvef_code',function (req,res) {
  let phoneNum = req.query.phoneNum;

  let code = sms_utils.randomCode(6);

  sms_utils.sendCode(phoneNum,code,function (success) {
    if(success) {
      users[phoneNum] = code;

      res.send({code:0,msg:"验证码已经发送"});
    }else {
      res.send({code:1,msg:"验证码发送失败"});
    }

  })

})

router.get('/more_goods',function (req,res) {
  const page = req.query.page;
  const comGoods = require('../data/comGoods');
  let goodsInfo=[];
  console.log(comGoods.length)
  console.log("page\n"+page*10)
  let goodsLength = (page+1)*10>comGoods.length?comGoods.length:(page+1)*10;
  for(let i =page*10;i<goodsLength;i++){
    goodsInfo.push(comGoods[i]);
  }
  setTimeout(function () {
    res.send({code:0,goodsInfo,total:comGoods.length});
  },2000);
})

router.post('/login',function (req,res) {
  const phoneNum = req.body.phoneNum;
  const password = req.body.password;
  UserModel.findOne({phoneNum,password},function (err,user) {
    if(user) {
      res.send({code:0,user})
    }else {
      res.send({code:1,msg:"用户名或者密码错误"})
    }
  })
})

router.post('/add_address',function(req,res) {
  let _id = req.body._id;
  let  addressInfo ={
    userName:req.body.userName,
    userPhone:req.body.userPhone,
    region:req.body.region,
    detailAddress:req.body.detailAddress,
    defaultAddress:req.body.defaultAddress
  }
  let arr = [];

  UserModel.findOne({_id},function (err,user) {
    if(user) {
      arr = user.swiperData || [];
      console.log(arr)
      if(addressInfo.defaultAddress && arr.length>0) {
        arr.forEach(item => item.defaultAddress = false)
      }
      arr.push(addressInfo);
      console.log(user)
      UserModel.update({_id},{swiperData:arr},function (err,raw) {
        if (err) {
          res.send({code:1,msg:"添加地址失败"});
        }else {
          console.log(raw)
        }
      })
      res.send({code:0,user})
    }else {
      res.send({code:1,msg:"用户名或者密码错误"})
    }
  })


})
router.get('/get_address',function (req,res) {

  const _id = req.query._id;
  // const goodsInfo = require('../data/goodDetail')
  let arr = [];

  UserModel.findOne({_id},function (err,user) {

    if(user) {

      arr =user.swiperData;


      res.send({code:0,addresses:user.swiperData});
    }else {
      res.send({code:1,msg:"获取地址失败"})
    }
  })

})
router.get('/del_address',function (req,res) {

  const _id = req.query._id;
  const sId = req.query.sId;
  let arr;
  let result;
  UserModel.findOne({_id},function (err,user) {

    if(user) {
      arr = user.swiperData ;

      result =arr.filter((item,index) => {
        return item._id != sId;
      })
      //判断如果删除是默认地址  设置第一个为默认地址
      let flag=false;
      result.forEach(item=>{
        if(item.defaultAddress) {

        }else {
          flag=true;
        }
      })
      if(flag) {
        result[0].defaultAddress=true;
      }
      //更新数据库中的地址信息i
      console.log("result=")
      console.log(result)
      UserModel.updateOne({_id},{swiperData: result},(err,data)=>{
        if(data) {

          res.send({code:0,addresses:result});
        }
      })


    }else {
      res.send({code:1,msg:"删除地址失败"})
    }
  })


})

router.get('/good_detail',function (req,res) {

  const id = req.query.id;
  // const goodsInfo = require('../data/goodDetail')
  const goodsInfo = require('../data/goodDetail')

  res.send(goodsInfo[id-1]);
})

router.get('/hot_search',function (req,res) {

  let arr = ['纸巾','面包','蛋糕','笔记本电脑','哈密瓜'];
  res.send({code:0,hotWords:arr})
})

router.get('/search_goods',function (req,res) {
  const goodTitle = req.query.goodTitle;
  const comGoods = require('../data/comGoods');
  let reg = new RegExp(goodTitle);
  let goods = comGoods.filter(item=>reg.test(item.goodTitle));

  res.send({code:0,goods})
})

router.get('/goods_list',function (req,res) {
  const goodTitle = req.query.goodTitle;
  const comGoods = require('../data/comGoods');
  let reg = new RegExp(goodTitle);
  let goodsList = comGoods.filter(item=>reg.test(item.goodTitle));

  res.send({code:0,goodsList})
})

router.get('/comments',function (req,res) {

  const id = req.query.id
  const comments = require('../data/comments')
  let comment = comments.filter(item=>{
     return item.id==id
  })
  console.log()
  res.send({code:0,comments:comment[0].comments})

})

module.exports = router;
