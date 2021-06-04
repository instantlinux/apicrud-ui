const { injectBabelPlugin } = require("react-app-rewired");

module.exports = {
  webpack: function(config, env) {
      if (env !== 'production') {
	  return config;
      }
      config = injectBabelPlugin(['@babel/plugin-transform-react-jsx'])
      return config;
  }
};
