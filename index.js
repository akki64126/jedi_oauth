const express = require('express');
const app = express();

app.set('view engine', 'ejs');
var access_token = "";

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

const port = process.env.PORT || 2400;
app.listen(port , () => console.log('App listening on port ' + port));

const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = '252811361ff1b885825d'
const clientSecret = 'a4e042f353d092273b8eb3005b138efb701801d7'

// Declare the callback route
app.get('/github/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
      const links= "https://github.com/" + response.data.login
    res.render('pages/success',{ userData: response.data, link: links });
  })
});