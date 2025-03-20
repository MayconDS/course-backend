const { DevEnvironment } = require("./environment.dev.js");
const { ProdEnvironment } = require("./environment.prod.js");

const getEnvironmentVariables = () => {
  if (process.env.NODE_ENV == "production") {
    return ProdEnvironment;
  }
  return DevEnvironment;
};
module.exports = getEnvironmentVariables;
