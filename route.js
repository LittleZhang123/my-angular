
/**
 * Created with JetBrains WebStorm.
 * User: c-sailor.zhang
 * Date: 1/23/13
 * Time: 1:47 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
var user = require('./route/user');
var role = require('./route/role');
var webSort = require('./route/webSort');
mongoose.connect('mongodb://localhost:12345/guide');

module.exports = function (app) {

    var checkPower = function(req,res,next){
        // if(!user.__isExsitUserSession(req)){
        //     return res.send({hasPower:false,cause:'没有登录'})
        // }

        // role.checkPower(req.session.user.Role,req.route.path,function(hasPower,err){
        //     if(err){
        //         return res.send({hasPower:false,cause:'权限不足'})
        //     }
        //     if(!hasPower){
        //         return res.send({hasPower:false,cause:'权限不足'})
        //     }
        //     next();
        // })
       next(); 
    }

    //权限
    var power = []

    var apiFn = [

    //user
    {
        name:'登陆',
        method:'post',
        url:'/user/signin',
        isCheckPower:false,
       // centerBtn:function(res,req,next){console.log('111');next()},
        func:user.signin
    },
    {
        name:'用户增添修改',
        method:'post',
        url:'/user/add',
        isCheckPower:true,
        //centerBtn:
        func:user.add
    },
    {
        name:'是否已登陆',
        method:'get',
        url:'/user/isSignIn',
        isCheckPower:false,
        //centerBtn:
        func:user.isSignIn
    },
    {
        name:'退出登陆',
        method:'get',
        url:'/user/signUp',
        isCheckPower:false,
        //centerBtn:
        func:user.signUp
    },
    {
        name:'获取所有用户',
        method:'get',
        url:'/user/list',
        isCheckPower:true,
        //centerBtn:
        func:user.list
    },
    {
        name:'获取某个用户',
        method:'get',
        url:'/user/findOne/:id',
        isCheckPower:true,
        //centerBtn:
        func:user.findOne
    },
    {
        name:'删除某个用户',
        method:'delete',
        url:'/user/deleteOne/:id',
        isCheckPower:true,
        //centerBtn:
        func:user.deleteOne
    },

    //role
    {
        name:'获取所有role',
        url:'/role/list',
        method:'get',
        isCheckPower:true,
        func:role.list
    },
    {
        name:'获取某个role',
        url:'/role/findOne/:id',
        method:'get',
        isCheckPower:true,
        func:role.findOne
    },
    {
        name:'增添或修改role',
        url:'/role/add',
        method:'post',
        isCheckPower:true,
        func:role.add
    },
    {
        name:'删除一条数据',
        url:'/role/deleteOne/:id',
        method:'delete',
        isCheckPower:true,
        func:role.deleteOne
    },

    //webSort
    {
        name:'获取所有网站分类',
        url:'/webSort/list',
        method:'get',
        isCheckPower:true,
        func:webSort.list
    },
    {
        name:'获取某个网站分类',
        url:'/webSort/findOne/:id',
        method:'get',
        isCheckPower:true,
        func:webSort.findOne
    },
    {
        name:'增添或修改网站分类',
        url:'/webSort/add',
        method:'post',
        isCheckPower:true,
        func:webSort.add
    },
    {
        name:'删除一条数据',
        url:'/webSort/deleteOne/:id',
        method:'delete',
        isCheckPower:true,
        func:webSort.deleteOne
    },

    ]

    for(var i in apiFn){
        var apiOne = apiFn[i]    
        if(apiOne.isCheckPower){
            //权限
            power.push(apiOne.url)
        }
        if(apiOne.isCheckPower){
            app[apiOne.method](apiOne.url,checkPower,apiOne.func)
        }else{
            app[apiOne.method](apiOne.url,apiOne.func)
        }
    }

    //获取所有方法
    app.get('/power/get',function(req,res){
        res.send(power)
    })

	//user
    // app.post('/user/signin', user.signin)
    // app.post('/user/add', user.add)
    // app.get('/user/isSignIn', user.isSignIn)
    // app.get('/user/signUp',user.signUp)
    // app.get('/user/list',user.list)
    // app.get('/user/findOne/:id',user.findOne)
    // app.delete('/user/deleteOne/:id',user.deleteOne)
};
