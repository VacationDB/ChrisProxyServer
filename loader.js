const fs = require('fs');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const exists = Promise.promisify(fs.stat);

const loadBundle = (services, item, filename) => {
  // add a small delay to ensure pipe has closed
  setTimeout(() => {
    console.log(`Loading: ${filename}`);
    services[item] = require(filename).default;
  }, 0);
};

const fetchBundles = ( path, services, ext = "js", suffix = "", require = false) => {
  Object.keys(services).forEach(item => {
    const filename = `${path}/${item}${suffix}.${ext}`;
    exists(filename)
      .then(() => {
        require ? loadBundle(services, item, filename) : null;
      })
      .catch(err => {
        if (err.code === "ENOENT") {
          const url = `${services[item]}${suffix}.${ext}`;
          console.log(`Fetching: ${url}`);
          fetch(url)
            .then(res => res.text())
            .then(text => {
              const dest = fs.createWriteStream(filename);
              dest.write(text, () => {
                require
                  ? loadBundle(services, item, filename)
                  : console.log("Fetched " + url);
              });
            });
        } else {
          console.log("WARNING: Unknown fs error");
        }
      });
  });
};

module.exports = (clientPath, serverPath, serviceConfig) => {
  const services = Object.assign({}, serviceConfig);
  fetchBundles(clientPath, services);
  fetchBundles(clientPath, services, "css");
  fetchBundles(serverPath, services, "js", "-server", true);

  return services;
};