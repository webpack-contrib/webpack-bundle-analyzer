module.exports = [
  {
    'label': 'bundle.js',
    'isAsset': true,
    'statSize': 142,
    'parsedSize': 58,
    'gzipSize': 71,
    'groups': [
      {
        'label': 'src',
        'path': './src',
        'statSize': 142,
        'groups': [
          {
            'id': 602,
            'label': 'index.js + 2 modules (concatenated)',
            'path': './src/index.js + 2 modules (concatenated)',
            'statSize': 142,
            'parsedSize': 58,
            'gzipSize': 71,
            'concatenated': true,
            'groups': [
              {
                'label': 'src',
                'path': './src/index.js + 2 modules (concatenated)/src',
                'statSize': 142,
                'groups': [
                  {
                    'id': null,
                    'label': 'index.js',
                    'path': './src/index.js + 2 modules (concatenated)/src/index.js',
                    'statSize': 62,
                    'parsedSize': 25,
                    'gzipSize': 30,
                    'inaccurateSizes': true
                  },
                  {
                    'id': null,
                    'label': 'a.js',
                    'path': './src/index.js + 2 modules (concatenated)/src/a.js',
                    'statSize': 40,
                    'parsedSize': 16,
                    'gzipSize': 20,
                    'inaccurateSizes': true
                  },
                  {
                    'id': null,
                    'label': 'b.js',
                    'path': './src/index.js + 2 modules (concatenated)/src/b.js',
                    'statSize': 40,
                    'parsedSize': 16,
                    'gzipSize': 20,
                    'inaccurateSizes': true
                  }
                ],
                'parsedSize': 58,
                'gzipSize': 71,
                'inaccurateSizes': true
              }
            ]
          }
        ],
        'parsedSize': 58,
        'gzipSize': 71
      }
    ]
  }
];
