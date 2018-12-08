
let config = require('../config/globals');
let bcrypt = require('bcrypt')
let db = config.mysql.getClient();
let redis = config.redis;
let Users = db.import('../models/users');
let jwt = require('jsonwebtoken');
let logger = config.logger;
let elasticsearch = config.elasticsearch;

async function login({
  email,
  password
}) {
  let user = await users.findOne({
    where: {
      email: email
    }
  });

  if (bcrypt.compareSync(password, user.password)) {

    let tok = await get_token_for_auth(email)
    return {
      found: true,
      id: tok
    };
  }
  return {
    found: false
  };
}

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
  // console.log("body-------",body  );
  

  // let hash = bcrypt.hashSync(body.password, 10);
  // let user = {
  //   email: body.email,
  //   password: hash,
  //   name: body.name,
  //   createdAt: new Date()
  // };
  // return users.create(user);


}
//check if user already signedin using redis
async function login_check(email, token, handler) {
  redis.get(email, (err, reply) => {

    if (reply == token) {

      return handler(true)
    } else {
      return handler(false)
    }
  });
}

//get access token for logged in users.
async function get_token_for_auth(email, new_pass) {
  let token = jwt.sign({
    email: email,
    pass: new_pass
  }, 'password-test');
  redis.set(email, token)
  return token
}

//reset password and delete user access token
function reset(email, password, handler) {
  redis.del(email)
  users.update({
    password: bcrypt.hashSync(password, 10)
  }, {
    where: {
      email: email
    }
  }).then(function () {
    handler()
  })
}

function logout(email) {
  try {
    redis.del(email)
    return true
  } catch (e) {
    return false
  }


}
// create link to reset password, the link can be sent to email for secure authentication.
function create_token_forgot(email, new_pass, handler) {
  jwt.sign({
    email: email,
    new_pass: new_pass
  }, 'password-test', (err, token) => {
    if (err) handler(false)
    else {
      return handler("http:/link-to-reset/?token=" + token)
    }
  });
}

//verifying the jwt token to reset user password
function verify_forgot(token, handler) {
  jwt.verify(token, 'password-test', (err, val) => {
    if (err) handler(false)
    else {
      users.update({
        password: bcrypt.hashSync(val.new_pass, 10)
      }, {
        where: {
          email: val.email
        }
      }).then(function () {
        handler(true)
      })
    }

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
// async function get_user_posts(user,page){
//   return await elasticsearch.search({
//     index: 'user_posts',
//     'from': (page * 10) - 10,
//     'size': 100,
//     body: {
//       query: {
//       "match_all":{

//       }
//       }
//     }
//   });
// }

module.exports = {
  login,
  register_user,
  reset,
  login_check,
  create_token_forgot,
  verify_forgot,
  create_post,
  get_posts,
  // get_user_posts
}