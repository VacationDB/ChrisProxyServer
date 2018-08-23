const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

// const Layout = require('./templates/layout');
// const App = require('./templates/app');
// const Scripts = require('./templates/scripts');

// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET');
  next();
});

app.use('/', express.static('public'));
// app.use('/listing/:listingId', express.static('public'));
app.use('/search/:listingId', express.static('public'));

// Search
app.use('/api/searchListings/:listingsId', proxy({target: 'http://ec2-18-212-25-211.compute-1.amazonaws.com:2999/'}));

// // Reviews
// app.use('/reviews/:id', proxy({target: 'http://ec2-18-216-90-61.us-east-2.compute.amazonaws.com:80/'}));

// // Details
// app.use('/api/details/:listingId', proxy({target: 'http://ec2-54-200-238-109.us-west-2.compute.amazonaws.com:80/'}));

// // Book
// app.use('/api/listings/:listingId', proxy({target: 'http://ec2-13-59-22-40.us-east-2.compute.amazonaws.com:80/'}));

const port = process.env.PORT || 4055;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));