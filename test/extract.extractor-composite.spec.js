const expect               = require('chai').expect;
const extractor            = require('../src/extract');
const cjsRecursiveFixtures = require('./extractor-fixtures/cjs-recursive.json');
const amdRecursiveFixtures = require('./extractor-fixtures/amd-recursive.json');

function runRecursiveFixture(pFixture) {
    if (!Boolean(pFixture.ignore)){
        it(pFixture.title, () => {
            expect(
                extractor.extract(
                    pFixture.input.fileName,
                    pFixture.input.options
                )
            ).to.deep.equal(pFixture.expected);
        });
    }
}

describe('CommonJS recursive - ', () => cjsRecursiveFixtures.forEach(runRecursiveFixture));
describe('AMD recursive - ', () => amdRecursiveFixtures.forEach(runRecursiveFixture));
