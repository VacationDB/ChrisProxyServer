const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET');
  next();
});

app.use('/', express.static('public'));
app.use('/listing/:listingId', express.static('public'));

// Reviews
app.use('/reviews/:id', proxy({target: 'http://ec2-18-216-90-61.us-east-2.compute.amazonaws.com:80/'}));

// Details
app.use('/api/details/:listingId', proxy({target: 'http://ec2-54-200-238-109.us-west-2.compute.amazonaws.com:80/'}));

// Book
app.use('/api/listings/:listingId', proxy({target: 'http://ec2-13-59-22-40.us-east-2.compute.amazonaws.com:80/'}));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));