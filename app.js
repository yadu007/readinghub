let express = require('express');
// let path = require('path');
let bodyParser = require('body-parser');
let http = require('http');
let routes = require('./routes/app_end');
let config = require('./config/globals');
let middlewares = require('./middlewares')
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let cookieParser = require('cookie-parser');
let passport = require('passport');
let sassMiddleware = require('node-sass-middleware');
let path = require('path')
let app = express();
app.set('port', process.env.PORT || 3000);
app.set('host', '0.0.0.0');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(
    sassMiddleware({
        src: __dirname + '/sass',
        dest: __dirname + '/public/css',    
        debug: true,
        prefix:'/css'
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    store: new RedisStore({
        host: config.redis_cred.host,
        port: config.redis_cred.port,
        db: 1,
        pass: config.redis_cred.password
    }),
    secret: 'secret-test'
}));



app.use(passport.initialize());
app.use(passport.session());
middlewares.loadSessionHandlers();
middlewares.loadStrategies();


let model_sync = require('./models/sync_tables');


app.use('/', routes);

// Handle 404
app.use(function(req, res) {
    res.send({"response":"path not found"}, 404);
 });
 
 // Handle 500
 app.use(function(error, req, res, next) {
    res.status(500).send({"response":"Internal Server Error",err:error})
 
 });
let server = http.createServer(app)
server.listen(app.get('port'), app.get('host'), function() {
   
});

// module.exports = server;
