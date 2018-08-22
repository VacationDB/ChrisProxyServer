
module.exports = () => `
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
