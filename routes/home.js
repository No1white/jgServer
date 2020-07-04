var express = require('express');
var router = express.Router();


router.get('/banners',function (req,res) {
    const data = require('../data/banners');
    setTimeout(function () {
        res.send({code:0,data});
    },2000);
})

module.exports = router;