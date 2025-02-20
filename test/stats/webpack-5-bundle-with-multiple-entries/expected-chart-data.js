module.exports = [
  {
    'label': 'bundle.js',
    'isAsset': true,
    'statSize': 204,
    'parsedSize': 488,
    'gzipSize': 297,
    'groups': [
      {
        'label': 'entry modules (concatenated)',
        'path': './entry modules (concatenated)',
        'statSize': 124,
        'parsedSize': 396,
        'gzipSize': 265,
        'concatenated': true,
        'groups': [
          {
            'label': 'src',
            'path': './entry modules (concatenated)/src',
            'statSize': 124,
            'groups': [
              {
                'id': 138,
                'label': 'index.js',
                'path': './entry modules (concatenated)/src/index.js',
                'statSize': 62,
                'parsedSize': 198,
                'gzipSize': 132,
                'inaccurateSizes': true
              }, {
                'id': 51,
                'label': 'index2.js',
                'path': './entry modules (concatenated)/src/index2.js',
                'statSize': 62,
                'parsedSize': 198,
                'gzipSize': 132,
                'inaccurateSizes': true
              }
            ],
            'parsedSize': 396,
            'gzipSize': 265,
            'inaccurateSizes': true
          }
        ]
      }, {
        'label': 'src',
        'path': './src',
        'statSize': 80,
        'groups': [
          {
            'id': 85,
            'label': 'a.js',
            'path': './src/a.js',
            'statSize': 40,
            'parsedSize': 46,
            'gzipSize': 66
          }, {
            'id': 326,
            'label': 'b.js',
            'path': './src/b.js',
            'statSize': 40,
            'parsedSize': 46,
            'gzipSize': 66
          }
        ],
        'parsedSize': 92,
        'gzipSize': 72
      }
    ]
  }
];
