#### Issue description
...

#### Technical info

<!--
Please include the output of running the command below:

npx envinfo --system --binaries --npmPackages='*webpack*' --npmGlobalPackages=webpack-bundle-analyzer 

-->

<pre>
REPLACE THIS TEXT WITH THE OUTPUT FROM THE COMMAND ABOVE
</pre>

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
})
```
`stats.json` will be created in Webpack bundle output directory.
