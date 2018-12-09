let app_api = require('../lib/app');
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
        let result = await app_api.register_user(req.body)
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
    
    let es_res = await app_api.create_post(data);
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
    let result = await app_api.get_posts(page);

    if(result.hits.total){
        let posts = result.hits.hits.map(function(e){
         e._source["post_id"] = e._id;
         return e._source;
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

let delete_post = async (req,res)=>{
    if(req.user){
        let id = req.query.id;
        let status = await app_api.delete_post(id);
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.write(JSON.stringify({
            status: 'ok',
            content: status
        }));
        res.end('\n');

    }
 
}
let get_single_post = async (req,res)=>{
    // if(req.user){
        let id = req.query.id;
        let status = await app_api.get_single_post(id);
        if(status.hits.hits.length){
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.write(JSON.stringify({
                status: 'ok',
                content: status.hits.hits[0]._source
            }));
            res.end('\n');
            
        }
        else{
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.write(JSON.stringify({
                status: 'ok',
                content: "None"
            }));
            res.end('\n');
            
        }
         
    // }
}
let update_post = async (req,res)=>{
    if(req.user){        
        let id = req.query.id;
        let title = req.query.title;
        let link = req.query.link;
        let description = req.query.desc;
        let status = await app_api.update_post({id:id,title:title,link:link,description:description});
        if(status.result=="updated"){
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.write(JSON.stringify({
                status: 'ok',
                content: "updated"
            }));
            res.end('\n');
        }
    }
}
let create_comment = async (req,res)=>{
    if(req.user){
        let user = req.user.name;
        let comm = req.query.comment;
        let comment = {user:user,text:comm};
        let post_id = req.query.post_id;
        let existing_comment = await app_api.get_single_post(post_id);
        let ex_com = existing_comment.hits.hits[0]._source.comments;
        ex_com.push(comment)
        let updated_st = await app_api.create_comment(post_id,ex_com);
        if(updated_st.result=="updated"){
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.write(JSON.stringify({
                status: 'ok',
                content: "comment added"
            }));
            res.end('\n');
        }

                
        // res.end('\n');

    }
    else{
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.write(JSON.stringify({
            status: 'ok',
            content: "login"
        }));
        res.end('\n');
    }
}

module.exports = {
    login,register,logout,app,register_user,create_post,get_posts,delete_post,get_single_post,update_post,create_comment
}
