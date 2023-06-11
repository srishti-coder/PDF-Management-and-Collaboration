const { merge } = require("webpack-merge");
const common = require("./webpack.config.common");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [new CssMinimizerWebpackPlugin(), new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        tailwindcss: {
          enforce: true,
        },
      },
    },
  },
});
