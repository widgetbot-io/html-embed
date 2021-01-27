const fs = require('fs')
const path = require('path')

module.exports = () => ({
  type: 'react-component',
  npm: {
    esModules: false,
    umd: {
      entry: './src/umd.ts',
      global: 'widgetbot'
    }
  },
  webpack: {
    extra: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js']
      }
    },
    config(config) {
      config.module.rules.push({
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: JSON.parse(
              fs.readFileSync(path.join(__dirname, 'dev.babelrc'), 'utf8')
            )
          },
          'ts-loader'
        ]
      })

      config.entry = config.entry.map(
        path => (path.endsWith('index.js') ? path.replace(/js$/, 'ts') : path)
      )

      const outputDirs = config.output.filename.split('/')
      config.output.filename = outputDirs[outputDirs.length - 1]

      return config
    }
  }
})
