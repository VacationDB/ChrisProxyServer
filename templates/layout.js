
module.exports = (body, scripts) => `
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
