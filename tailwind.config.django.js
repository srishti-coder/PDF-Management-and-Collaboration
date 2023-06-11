const tailwindConfig = require("./tailwind.config.js");

module.exports = Object.assign({}, tailwindConfig, {
  content: ["./templates/**/*.html"],
});
