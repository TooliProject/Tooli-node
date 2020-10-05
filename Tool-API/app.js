const express = require('express');
const session = require('express-session');
const sessionSecret = require('./credentials/session_secret.json');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const listRouter = require('./routes/list');
const ssoGoogleRouter = require('./routes/sso/google');

const app = express();

app.use(session({secret: sessionSecret.secret, saveUninitialized: false, resave: false}));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    const paths = [
        '/api/v1/sso/google/login',
        '/api/v1/sso/google/isSignedIn',
        '/api/v1/sso/google'
    ]
   if(paths.indexOf(req.path) < 0
        && (!req.session.accessHeader
            || Date.now() > new Date(req.session.accessHeader.expires))) {
       res.redirect('/api/v1/sso/google/login?state=' + req.path);
   } else {
       next();
   }
});

app.use('/api/v1/list', listRouter);
app.use('/api/v1/sso/google', ssoGoogleRouter);

app
    .use(express.static(path.join(__dirname, 'public')))
    .all('/*', ((req, res) => {
        console.log('All');
        res
            .status( 200 )
            .set( { 'content-type': 'text/html; charset=utf-8' } )
            .sendfile('public/index.html' );
    }));
module.exports = app;
