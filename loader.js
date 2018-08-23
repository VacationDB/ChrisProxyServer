const fs = require('fs');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const exists = Promise.promisify(fs.stat);

const loadBundle = function(cache, item, filename) {
  // add a small delay to ensure pipe has closed
  setTimeout(() => {
    console.log('loading:', filename);
    cache[item] = require(filename).default;    
  }, 0);
};

const fetchBundles = (path, services, suffix = '', require = false) => {
  Object.keys(services).forEach(service => {
    const filename = `${path}/${service}${suffix}.js`;
    exists(filename)
      .then(() => {
        require ? loadBundle(services, service, filename) : null;
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          const url = `${services[service]}${suffix}.js`;
          console.log(`Fetching: ${url}`);
          // see: https://www.npmjs.com/package/node-fetch
          fetch(url)
            .then(res => {
              const dest = fs.createWriteStream(filename);
              res.body.pipe(dest);
              res.body.on('end', () => {
                require ? loadBundle(services, service, filename) : null;
              });
            });
        } else {
          console.log('WARNING: Unknown fs error');
        }
      });
  });
};
//services is service config json which is jsut path to s3 bundle
module.exports = (clientPath, serverPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(serverPath, services, '-server', true);

  return services;
};
