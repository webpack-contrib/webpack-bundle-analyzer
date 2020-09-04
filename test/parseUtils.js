const fs = require('fs');

const _ = require('lodash');
const {parseBundle} = require('../lib/parseUtils');

const BUNDLES_DIR = `${__dirname}/bundles`;
const COMPRESSIONS = {
  brotli: {extension: 'br', minVersion: '11.7.0'},
  gzip: {extension: 'gz'}
};

describe('parseBundle', function () {
  const bundles = fs
    .readdirSync(BUNDLES_DIR)
    .filter(filename => filename.endsWith('.js'))
    .map(filename => filename.replace(/\.js$/u, ''));

  bundles
    .filter(bundleName => bundleName.startsWith('valid'))
    .forEach(bundleName => {
      it(`should parse ${_.lowerCase(bundleName)}`, function () {
        const bundleFile = `${BUNDLES_DIR}/${bundleName}.js`;
        const bundle = parseBundle(bundleFile);
        const expectedModules = JSON.parse(fs.readFileSync(`${BUNDLES_DIR}/${bundleName}.modules.json`));

        expect(bundle.src).to.equal(fs.readFileSync(bundleFile, 'utf8'));
        expect(bundle.modules).to.deep.equal(expectedModules.modules);
      });
    });

  it("should parse invalid bundle and return it's content and empty modules hash", function () {
    const bundleFile = `${BUNDLES_DIR}/invalidBundle.js`;
    const bundle = parseBundle(bundleFile);
    expect(bundle.src).to.equal(fs.readFileSync(bundleFile, 'utf8'));
    expect(bundle.modules).to.deep.equal({});
  });

  Object.keys(COMPRESSIONS)
    .forEach(compressionType => {
      it(`should parse compressed ${compressionType} bundle`, function () {
        const {extension, minVersion} = COMPRESSIONS[compressionType];
        const bundleFile = `${BUNDLES_DIR}/validBundleWithArrowFunction.js`;
        const compressedBundleFile = `${bundleFile}.${extension}`;
        const expectedModules = JSON.parse(fs.readFileSync(`${BUNDLES_DIR}/validBundleWithArrowFunction.modules.json`));
        const bundle = parseBundle(compressedBundleFile);
        if (minVersion && !hasNodeVersion(minVersion)) {
          expect(bundle.src).to.not.equal(fs.readFileSync(bundleFile, 'utf8'));
          expect(bundle.modules).to.deep.not.equal(expectedModules.modules);
        } else {
          expect(bundle.src).to.equal(fs.readFileSync(bundleFile, 'utf8'));
          expect(bundle.modules).to.deep.equal(expectedModules.modules);
        }
      });
    });

});
