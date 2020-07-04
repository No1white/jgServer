let  events = require('events');
let fs = require('fs')
let ee =new events.EventEmitter;


ee.on('helloSuccess',function (eventMsg) {
    console.log("11111")
    console.log(eventMsg)
})

ee.on('helloSuccess',function () {
    console.log("2222")
})


fs.readFile('hello.txt',{encoding:"utf-8"},function (err,data) {
    if(err){
        console.log(err);
    }else {
        console.log(data);
        ee.emit("helloSuccess",data)
    }
})

function lcReadFile(path) {
    console.log(1)
    return new Promise((resolve, reject) => {
        console.log(2)
        fs.readFile(path,{encoding:"utf-8"},function (err,data) {
            console.log(3)
            if(err) {
                reject(err)
            }else {
                console.log(4)
                console.log(data)
                resolve(data);
            }
        })
    })
}
lcReadFile('hello.txt').then(function (data) {
    console.log(5)
    ee.emit('helloSuccess',data)
})