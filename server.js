const express = require('express')
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 4055;

// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const apiConfig = require("./api-config.json");

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);
const serviceNames = Object.keys(services);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');
 
// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf


const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
};

app.get('/search/:listingId', function(req, res) {
  let components = renderComponents(services, {itemid: req.params.listingId});
  res.end(Layout(
    App(...components),
    Scripts(Object.keys(services))
  ));
});

// app.get('/search/:listingId', function(req, res) {
//   res.end(Layout( App ('component to be'),
//     Scripts()
//   ));
// });

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
 

//Alternate for local bundles**********



// const React = require('react');
// const ReactDom = require('react-dom/server');


// // see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
// const Scripts = (items, props) => `
//   ${items.map(item => {
//       return `<script src="/services/${item}.js"></script>`;
//     }).join("\n")}
//   <script>
//     ${items.map(item => `
//       ReactDOM.hydrate(
//         React.createElement(${item}, ${JSON.stringify(props[item])}),
//         document.getElementById('${item}')
//       );`
//       ).join("\n")}
//   </script>
//   `;

// const Layout = (body, scripts) => `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <link rel="stylesheet" href="/style.css">
//     <title>Proxy</title>
//   </head>
//   <body>
//   ${body}
//   </body>
//   ${scripts}
// </html>
// `;
// const App = (navigation) => `
// <div id="navigation">${navigation}</div>
// `;
// let window = global;
// const serverBundle = require('./bundle-server.js')

// const renderComponents = (components, props = {}) => {
//   return Object.keys(components).map(item => {
//     let component = React.createElement(components[item], props);
//     return ReactDom.renderToString(component);
//   });
// };

// app.get('/search/:listingId', function(req, res) {
//   let component = renderComponents(services, {itemid: req.params.listingId});
//   res.end(Layout( App(component), Scripts(Object.keys(services))
//   ));
// });

// app.get('/search/:listingId', function(req, res) {
//   res.end(Layout( App ('component to be'),
//     Scripts()
//   ));
// });

// app.listen(port, () => {
//   console.log(`server running at: http://localhost:${port}`);
// });