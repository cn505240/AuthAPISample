const dotenv = require('dotenv');
var pgtools = require('pgtools');

dotenv.config();

const config = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

pgtools.createdb(config, process.env.DB_NAME, function (err, res) {
  if (err) {
    console.error(err);
    throw new Error('Failed to initialize database');
  }
  console.log(res);
});
