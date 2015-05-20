var express =require('express');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 3000;
var route = require('./route');
var fs = require('fs');
var ueditor = require("ueditor");
var app = express();

// var Model = require('./Models/Model');
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:12345/NO1');

var isDevelopment = true
if (isDevelopment){
	app.set('showStackError', true)
	//app.use(express.logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

app.use('/bower_components',express.static('./bower_components'));

app.use(express.static(path.join(__dirname, '/data')));
app.use(express.static(path.join(__dirname, '/app')));
app.use(cookieParser())
app.use(session({
	secret:'myangualr'
}))
app.set('view engine','html');
app.listen(port);

app.use(bodyParser());


//使用ueditor
app.use("/bower_components/ueditor/ue", ueditor(path.join(__dirname, 'app'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        
        var imgname = req.ueditor.filename;

        var img_url = '/images/ueditor/' ;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/bower_components/ueditor/nodejs/config.json');
    }
}));

console.log('port start');


route(app);
