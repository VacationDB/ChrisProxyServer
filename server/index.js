const express = require('express');
const proxy = require('http-proxy-middleware');
const React = require("react");
const ReactDom = require('react-dom/server');

const app = express();

// const Layout = require('./templates/layout');
// const App = require('./templates/app');
// const Scripts = require('./templates/scripts');

// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
const Scripts = () => `
  <script src="/lib/react.development.js"></script>
  <script src="/lib/react-dom.development.js"></script>

  <script src="/bundle.js"></script>

  <script>
      ReactDOM.hydrate(
        React.createElement(< Navigation />),
        document.getElementById('navigation')
      );
  </script>
`;
const Layout = (body, scripts) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/style.css">
    <title>Proxy</title>
  </head>
  <body>
  ${body}
  </body>
  ${scripts}
</html>
`;
const App = (navigation) => `
<div id="navigation">${navigation}</div>
`;


// const renderComponents = (components, props = {}) => {
//   return Object.keys(components).map(item => {
//     let component = React.createElement(components[item], props);
//     return ReactDom.renderToString(component);
//   });
// };

app.get('/search/:listingId', function(req, res) {
  let component = ReactDom.renderToString('./bundle.js')
  res.end(Layout( App (component),
    Scripts()
  ));
});

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