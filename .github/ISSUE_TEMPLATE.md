#### Issue description
...

#### Technical info
* Webpack Bundle Analyzer version:
* Webpack version:
* Node.js version:
* npm/yarn version:
* OS:

#### Debug info
How do you use this module? As CLI utility or as plugin?

If CLI, what command was used? (e.g. `webpack-bundle-analyzer -O path/to/stats.json`)

If plugin, what options were provided? (e.g. `new BundleAnalyzerPlugin({ analyzerMode: 'disabled', generateStatsFile: true })`)

What other Webpack plugins were used?

It would be nice to also attach webpack stats file.
It can be generated using these options:
```js
new BundleAnalyzerPlugin({
  analyzerMode: 'disabled',
  generateStatsFile: true,
  // Excludes module sources from stats file so there won't be any sensitive data
  statsOptions: { source: false }
})`
```
`stats.json` will be created in Webpack bundle output directory.
