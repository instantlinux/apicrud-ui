const { override, addExternalBabelPlugins } = require('customize-cra');

module.exports = override(...addExternalBabelPlugins(
    '@babel/plugin-transform-react-jsx'
  )
);
