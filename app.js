const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.set('view engine', 'ejs');

let access_token = "";
app.get('/', (req, res) => {
    res.render('pages/index', { client_id: clientID });
});

app.get('/github/callback', (req, res) => {
    const { code } = req.query;

    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        access_token = response.data.access_token;
        res.redirect('/success');
    })
})

app.get('/success', (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: 'token ' + access_token,
        }
    }).then((response) => {
        res.render('pages/success', { userData: response.data });
    })
})

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log('Server listening on port:', PORT);
});