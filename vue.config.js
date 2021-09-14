module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: './vue/src/main.js',
    }
  },
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ],
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    proxy: {
      '^/':{
        target:'http://localhost:778'
      },
      
    }
  },
  // outputDir: "./dist",
  // publicPath: '/dist'
}