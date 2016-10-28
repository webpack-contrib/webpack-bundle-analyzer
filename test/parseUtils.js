const fs = require('fs');

const _ = require('lodash');
const { expect } = require('chai');
const { getModuleSizesFromBundle } = require('../lib/parseUtils');

const BUNDLES_DIR = `${__dirname}/bundles`;

describe('parseUtils', function () {
  describe('getModuleSizesFromBundle', function () {
    const bundles = fs
      .readdirSync(BUNDLES_DIR)
      .filter(filename => filename.endsWith('.js'))
      .map(filename => filename.replace(/\.js$/, ''));

    bundles
      .filter(bundleName => bundleName.startsWith('valid'))
      .forEach(bundleName => {
        it(`should parse ${_.lowerCase(bundleName)}`, function () {
          const parsedSizes = getModuleSizesFromBundle(`${BUNDLES_DIR}/${bundleName}.js`);
          const expectedSizes = JSON.parse(fs.readFileSync(`${BUNDLES_DIR}/${bundleName}.sizes.json`));

          expect(parsedSizes).to.eql(expectedSizes);
        });
      });
  });
});
