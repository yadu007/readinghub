let api_lib = require('../lib/api');
var ejs = require('ejs');

//login function : login user and respond with access token.
let login =  function(req,res){
    

if(req.user){
    // console.log("re----",req.user);
    
    res.render('app',{'user':req.user.name})
}
else{
    res.render("login",{"message":req.query.message})
}
  
}
//register function : creating new user 
let register =  (req,res)=>{
    res.render("register")
}
//reset function :  reseting password if user signedin
let reset = async function(req,res){
    let key = req.get('x-api-key')
    if(key){
    api_lib.login_check(req.body.email,key,(resp)=>{
        if(resp){
            if(!req.body.new_pass){
                res.status(200).json({
                    msg: "new password required"
                });
                res.end();
            }
            else{
                api_lib.reset(req.body.email,req.body.new_pass,()=>{
                    res.status(200).json({
                        msg: "password updated"
                    });
                    res.end();
                });



            }
;
        }
        else{
            res.status(200).json({
                msg: "Please login to reset the password"
            });
        }

       })


    }

}
//forgot password function: user will request for rest via POST and verifying identity via GET 
let forgot = function(req,res){
    if (req.method == "POST") {

        api_lib.create_token_forgot(req.body.email,req.body.new_pass,(forgot_ink)=>{
            if(forgot_ink){
                res.status(200).json({
                    forgot_link: forgot_ink
                });
            }
        })
    }
    else if(req.method == "GET"){
        api_lib.verify_forgot(req.query.token,(val)=>{
            if(val){
                res.status(200).json({
                    response: "done reseting"
                });
            }
            else{
                res.status(200).json({
                    response: "error in reset"
                });

            }
        })

    }
}
//middleware to check if the user logged in
let login_check = async (req,res,next)=>{
    let key = req.get('x-api-key')
    if(key){
    api_lib.login_check(req.body.email,key,function(resp){
        if(resp){

        res.status(200).json({
         msg: "already logged in."
     });
     res.end();
        }
        else{
            next()
        }

       })


    }
    else{
        next()
    }

}
let checker = (req,res)=>{
    res.redirect("/yoyo")
}
let logout = (req,res)=>{
    if(req.user){
        req.logout();
        req.session.destroy();
        res.render('login',{message:"Logout Success"});
    }
    else{
        res.render('login',{message:""});
    }
 
}
let app = (req,res)=>{
    if(req.user){
        res.render('app',{user:req.user.name})
    }
    else{
        res.render('app',{user:""})
    }
}
let register_user = async (req,res)=>{
        let result = await api_lib.register_user(req.body)
        res.render('login',{message:result.message})

  
}
let create_post = async (req,res)=>{
    if(req.user){
  
    let link = req.query.link;
    let title = req.query.title;
    let desc = req.query.desc;
    let user_id = req.user.id;
    let user_name = req.user.name;
    let data = {uid:user_id,uname:user_name,link:link,title:title,description:desc}
    
    let es_res = await api_lib.create_post(data);
    if(es_res.result=='created'){
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.write(JSON.stringify({
            status: 'ok',
            content: "done"
        }));
        res.end('\n');
    }
    else{
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.write(JSON.stringify({
            status: 'error',
            content: "error"
        }));
        res.end('\n');
    }
    
   

}
}


let get_posts = async (req,res)=>{
    let page = req.query.page || 1
    let result = await api_lib.get_posts(page);

    if(result.hits.total){
        let posts = result.hits.hits.map(function(e){
            return e._source
        })
        if(req.user){
            ejs.renderFile('views/post_result.ejs', {posts:posts,total:result.hits.total,page:page,user:req.user.id}, function(err, doc) {
                console.log(err);
                
                res.writeHead(200, {
                    'content-type': 'application/json'
                });
                res.write(JSON.stringify({
                    status: 'ok',
                    content: doc
                }));
                res.end('\n');
            })
        }
        else{
            ejs.renderFile('views/post_result.ejs', {posts:posts,total:result.hits.total,page:page,user:NaN}, function(err, doc) {
                console.log(err);
                
                res.writeHead(200, {
                    'content-type': 'application/json'
                });
                res.write(JSON.stringify({
                    status: 'ok',
                    content: doc
                }));
                res.end('\n');
            })
        }
        
        


       
    }
    
}

module.exports = {
    login,register,checker,logout,app,register_user,create_post,get_posts
}
