let express = require('express');
let cors = require('cors');

let app = express();
app.use(cors());
const parseRawBody = (req, res, next) => {
  req.setEncoding('binary');
  req.rawBody = '';
  req.on('data', chunk => {
    req.rawBody += chunk;
  });
  req.on('end', () => {
    next();
  });
};
app.use(parseRawBody);

module.exports = {
  app
};
