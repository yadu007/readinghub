let express = require('express');
let router = express.Router();
let passport = require('passport');
const control = require('../controllers/app')
const middleware = require("../middlewares")

// router.post('/login',login_check,login);
router.get('/register', control.register);
router.get('/app', control.app) ;
router.get('/login', control.login);
router.post('/auth/email', passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/login?message=Wrong Username or Password',
    failureFlash: true
}));
router.post('/register_user',control.register_user)
router.get("/logout",control.logout)
router.get("/",control.app)
router.get("/create_post",control.create_post);
router.get("/get_posts",control.get_posts)
router.get('/delete_post',control.delete_post);
router.get('/get_single_post',control.get_single_post);
router.get('/update_post',control.update_post);
router.get('/create_comment',control.create_comment);
module.exports = router;