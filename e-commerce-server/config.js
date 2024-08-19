const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  secretkey: process.env.RAJAONGKIR_API_KEY,
};
