
let config = require('../config/globals');
let bcrypt = require('bcrypt')
let db = config.mysql.getClient();
let redis = config.redis;
let Users = db.import('../models/users');
let jwt = require('jsonwebtoken');
let logger = config.logger;
let elasticsearch = config.elasticsearch;



//register new user
async function register_user(body) {
  return new Promise((resolve,reject)=>{

    Users
    .findOne({
        where: {
            email: body.email
        }
    })
    .then((account)=> {
        if (account) {
            let locals = {
                'message': 'Uh oh. This email already exists.'
            };
            
            resolve(locals);
  
        }
        let password = body.password || null;
        let name = body.name || null;
  
        let hash = bcrypt.hashSync(password, 10);
  
        Users
        .findOrCreate({
            where: {
                email: body.email,
                password: hash,
                name:name
               
            },
            defaults: {
                
                created_at: new Date()
            }
        })
        .spread((ela, created)=> {
            if (created) {
              resolve({"message":"Account Successfully created"});
                // logger.info('New email account:', ela.id, ela.email);
            }});
      })
  })


}



async function create_post(post_d){
 
  return await elasticsearch.index({
    index: 'user_posts',
    type :"_doc",
    body: {
      uid: post_d.uid,
      uname: post_d.uname,
      link: post_d.link,
      title: post_d.title,
      description: post_d.description,
      comments:[],
      votes:0
    }
  });
 
  
  
}
async function get_posts(page){
  return await elasticsearch.search({
    index: 'user_posts',
    'from': (page * 10) - 10,
    'size': 10,
    body: {
      query: {
      "match_all":{

      }
      }
    }
  });

}
async function delete_post(id){
  return await elasticsearch.deleteByQuery({
    index: 'user_posts',
    body: {
      query: {
        term: { _id: id }
      }
    }
  });
}

async function get_single_post(id){
  return await elasticsearch.search({
    index: 'user_posts',
    body: {
      query: {
        term: { _id: id }
      }
    }
  });
}

async function update_post(p_data){
  return await elasticsearch.update({
    index: 'user_posts',
    type: '_doc',
    id: p_data.id,
    body: {
      // put the partial document under the `doc` key
      doc: {
        title: p_data.title,
        link:p_data.link,
        description:p_data.description
      }
    }
  })
}
async function create_comment(id,comment){
  return await elasticsearch.update({
    index: 'user_posts',
    type: '_doc',
    id: id,
    body: {
      // put the partial document under the `doc` key
      doc: {
        comments: comment,
      }
    }
  })
}

module.exports = {
  register_user,
  create_post,
  get_posts,
  delete_post,
  get_single_post,
  update_post,
  create_comment
  // get_user_posts
}