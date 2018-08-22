const express = require('express')
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 4055;

app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

// const clientBundles = './public/services';
// const serverBundles = './templates/services';
// const serviceConfig = require('./service-config.json');
// const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
const Scripts = () => `
  <script src="/lib/react.development.js"></script>
  <script src="/lib/react-dom.development.js"></script>

  <script src="bundle.js"></script>

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

// const bundle = require('./bundle.js')
// const component = ReactDom.renderToString(bundle);

app.get('/search/:listingId', function(req, res) {
  res.end(Layout( App (),
    Scripts()
  ));
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
