var express = require('express');
var router = express.Router();
var db=require('../model/db.js')
var bodyParser = require('body-parser');
var ObjectId=require('mongodb').ObjectId;

router.get(`/`,(req,res)=>{
  db.find('article','item',{},(err,result)=>{
    res.render('index',{
      result:result,
      username:'',
      more:10
    })
  })  
})

router.get(`/showRegis`,(req,res)=>{
  res.render('register')
})

router.post(`/doRegis`,(req,res)=>{
  var whereStr={name:req.body.user}
  db.find('blogUser','item',whereStr,(err,result)=>{
    if(result.length>0){
      res.end(JSON.stringify(result))
    }else{
      //先插数据，再重定向
      var obj={name:req.body.user,pass:req.body.pass}
      db.insert('blogUser','item',obj,(err1,result1)=>{
          if(err1) throw err1;
          // res.redirect(`/showLogin`)  将跳转交给客户端实现
          res.end(JSON.stringify('ok'))
      })
    }
  })
})

//点击登录
router.get(`/showLogin`,(req,res)=>{
  res.render(`login`,{flag:11})
})

router.post(`/doLogin`,(req,res)=>{
  var whereStr={
    "name":req.body.user
  }
  db.find('blogUser','item',whereStr,(err,result)=>{
        if (err) {
            // res.send(500);
            res.end('后台出错了')
        } else if (!result.length) {
            req.session.error = '用户名不存在！';
            // res.send(404);
            /*res.set("Content-Type","text/plain")
            res.end('用户名不存在！')*/
               res.render(`login`,{flag:0})
        } else {
           if(req.body.pass != result[0].pass){
               req.session.error = "密码错误!";
               // res.send(404);
               /*res.set("Content-Type","text/plain")
               res.end('密码错误!')*/
               res.render(`login`,{flag:1})
           }else{
              req.session.user=result[0].name;
              req.session.right=result[0].right;
              res.redirect(`/index`)
           }
         }
  })
})

router.get(`/logout`,(req,res)=>{
  res.clearCookie(cookieName)   
  res.clearCookie(cookieName+'.sig')
  res.redirect(`/index`)
})

router.get(`/index`,(req,res)=>{
    var len=0;//数据库文档个数
    var arr=[]
    db.find('article','item',{},(err,result)=>{
      len=result.length;
      if(req.session.user){
        user=req.session.user
      }else{
        user=''
      }  
     if(!req.query.len){
          res.render('index',{
            result:result,
            username:user,
            more:10
          })    
        }else{
          var skip=parseInt(req.query.len);//一定要转换为数值
          var end=skip+6
          if(end>len){
            end=len;
          }
          arr=result.slice(skip,end);//每次加载更多数据个数为6
          if(skip==end){
            res.end(JSON.stringify('end'))
          }else{
            res.end(JSON.stringify(arr))
          }
      }
    })  
})

router.get(`/study`,(req,res)=>{
    db.find('article','item',{type:"study"},(err,result)=>{
      var html=0,css=0,js=0,jq=0,j=0;
      var arr=[];
      var id=req.query.id;
      for(var i=0;i<result.length;i++){
        if(result[i].category==id){
          arr[j++]=result[i]
        }
        if(result[i].category=='HTML'){
          html++;
        }else if(result[i].category=='CSS'){
          css++;
        }else if(result[i].category=='JavaScript'){
          js++;
        }else if(result[i].category=='jQuery'){
          jq++;
        }
      }
      if(arr.length>0){
        res.render(`study`,{
              result:arr,
              more:arr.length,
              html:html,
              css:css,
              js:js,
              jq:jq
            })
      }else{
        res.render(`study`,{
              result:result,
              more:result.length,
              html:html,
              css:css,
              js:js,
              jq:jq
            })
      }
    })
})

router.get(`/live`,(req,res)=>{
  db.find('article','item',{type:"study"},(err,result)=>{
    res.render(`live`,{
      result:result,
      more:result.length
    })
  })
  
})

router.get(`/write`,(req,res,next)=>{
  if(!req.session.user){
    res.redirect(`/showLogin`)
  }else if(req.session.right=='super'){
    next();
  }else{
    res.render(`error`)
  }
})

router.get(`/write`,(req,res)=>{
  res.render(`write`)
})

router.get(`/detail`,(req,res)=>{
  db.find('article','item',{},(err,result)=>{
    var html=0,css=0,js=0,jq=0,j=0;
    var arr=[];
    var id=req.query.id;
    for(var i=0;i<result.length;i++){
      if(result[i]._id==req.query.id){
        arr[j++]=result[i]
      }
      if(result[i].category=='HTML'){
        html++;
      }else if(result[i].category=='CSS'){
        css++;
      }else if(result[i].category=='JavaScript'){
        js++;
      }else if(result[i].category=='jQuery'){
        jq++;
      }
    }
    res.render(`detail`,{
              result:arr,
              more:arr.length,
              html:html,
              css:css,
              js:js,
              jq:jq
            })
  })
})

router.get(`/publish`,(req,res)=>{
  if(req.query&&req.session.right=='super'){
    var obj={
      author:req.session.user,
      title:req.query.title,
      category:req.query.category,
      con:[{conTit:req.query.title,conMain:req.query.con}],
      url:'/detail?id='+req.query.category,
      time:new Date().getFullYear()+'-'+(parseInt(new Date().getMonth())+1)+'-'+new Date().getDate()
    }
    db.insert('article','item',obj,function(err,result){
      res.send('ok')
    })
  }
  else{
    res.send('无权访问')
  }
})

router.get(`/article_manage`,(req,res)=>{
  if(req.session.user&&req.session.right=='super'){
    db.find('article','item',{},(err,result)=>{
      res.render('article_manage',{result:result})
    })
  }else{
    res.redirect(`/showLogin`)
  }
})

router.get(`/deleteArt`,(req,res)=>{
  if(req.session.user&&req.session.right=='super'){
    db.delete('article','item',{_id:new ObjectId(req.query.id)},(err,result)=>{  
      res.redirect(`/article_manage`)
    })
  }else{
    res.redirect(`/showLogin`)
  }
})

router.get(`/about`,(req,res)=>{
  if(req.session.user){
    db.find('blogUser','item',{name:req.session.user},(err,result)=>{
      res.render('about',{result:result[0]})
    })
  }else{
    res.redirect(`/showLogin`)
  }
})

router.post(`/doAbout`,(req,res)=>{
  if(req.session.user){
    var whereStr={"name":req.body.username};
    var updateStr={$set:{"nickname":req.body.nickname}}
    db.update('blogUser','item',whereStr,updateStr,function(err,result){
      res.send('ok')
    })
  }else{
    res.redirect(`/showLogin`)
  }
})

//不匹配任何路径，则报错
router.use(function(req,res){
  res.render(`error`)
})

module.exports = router;
