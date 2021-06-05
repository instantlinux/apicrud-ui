const { override, addBabelPresets, addExternalBabelPlugins
      } = require('customize-cra');

module.exports = override(
    ...addExternalBabelPlugins(
	'@babel/plugin-transform-react-jsx'
    ),
    ...addBabelPresets(
	'@babel/preset-react'
    )
);
