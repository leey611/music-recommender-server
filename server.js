const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios');
const PORT = process.env.PORT || 5000;
let lastFmClientKey;
let lastFmClientSecret;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  lastFmClientKey = process.env.REACT_APP_CLIENT_KEY;
  lastFmClientSecret = process.env.REACT_APP_CLIENT_SECRET;
} else {
  lastFmClientKey = process.env.CLIENT_KEY;
  lastFmClientSecret = process.env.CLIENT_SECRET;
}

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.post('/artists', async (req, res) => {
  const lastFmBaseUrl = 'https://ws.audioscrobbler.com/2.0/';
  const text = req.body.text
  console.log(`${lastFmBaseUrl}?method=artist.getsimilar&artist=${text}&api_key=${lastFmClientKey}&format=json`)
  try {
    const response = await axios.get(`${lastFmBaseUrl}?method=artist.getsimilar&artist=${text}&api_key=${lastFmClientKey}&format=json`)
    const data = response.data.similarartists;
    res.status(200).json(data)
  } catch (err) {
    res.status(500).send({ error: 'not working' })
  }
});

app.post('/albums', async (req, res) => {
  const lastFmBaseUrl = 'https://ws.audioscrobbler.com/2.0/';
  const text = req.body.text
  try {
    const response = await axios.get(`${lastFmBaseUrl}?method=artist.gettopalbums&artist=${text}&api_key=${lastFmClientKey}&format=json`)
    const data = await response.data.topalbums
    res.status(200).json(data)
  } catch (err) {
    res.status(500).send({ error: 'not working' })
  }
})

app.listen(PORT, () => console.log(`server listen on ${PORT}`));
