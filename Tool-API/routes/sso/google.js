const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
const express = require('express');
const axios = require('axios');
const router = express.Router();

const AccountRepository = require('../../data/database/account');
const ErrorHandler = require('../../error/error');

const REDIRECT_URI = 'http://localhost:3000/api/v1/sso/google'
const PROVIDER_GOOGLE = 'GOOGLE';

router.get('/login', (req, res) => {
   res.redirect("https://accounts.google.com/o/oauth2/v2/auth?" +
       "scope=email&" +
       "access_type=online&" +
       "include_granted_scopes=true&" +
       "response_type=code&" +
       "state=" + req.query.state + "&" +
       "redirect_uri=" + REDIRECT_URI + "&" +
       "client_id=" + googleCredentials.web.client_id);
});

router.get('/logout', (req, res) => {
   delete req.session.email;
   delete req.session.expires;
   delete req.session.accessHeader;
   res.redirect('/');
});

router.get('/', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const url = 'https://oauth2.googleapis.com/token?' +
        'code=' + code + '&' +
        'client_id=' + googleCredentials.web.client_id + '&' +
        'client_secret=' + googleCredentials.web.client_secret + '&' +
        'redirect_uri=' + REDIRECT_URI + '&' +
        'grant_type=authorization_code';
    axios.post(url)
        .then(response => {
            const metaString =
                Buffer.from(response.data.id_token.split('.')[1], 'base64').toString('ascii');
            const meta = JSON.parse(metaString);
            req.session.email = meta.email;
            req.session.expires = meta.exp;
            req.session.accessHeader = response.data;

            new AccountRepository().insertIfNotExists(meta.email, PROVIDER_GOOGLE, (err) => {
                if (err) {
                    new ErrorHandler().sendError(res, 500, err);
                } else {
                    res.redirect(state);
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/isSignedIn', (req, res) => {
   const isSignedIn = req.session && req.session.expires && Date.now() < new Date(req.session.expires * 1000);
   res.send({
    isSignedIn: isSignedIn
   });
});

module.exports = router;
