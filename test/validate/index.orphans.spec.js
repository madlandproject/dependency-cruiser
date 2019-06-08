const expect       = require('chai').expect;
const validate     = require('../../src/validate');
const _readRuleSet = require("./readruleset.utl");

describe("validate/index - orphans", () => {
    it("Skips modules that have no orphan attribute", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.json"),
                {source: "something"}
            )
        ).to.deep.equal({valid: true});
    });

    it("Flags modules that are orphans", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.json"),
                {source: "something", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-orphans", severity: "warn"}]});
    });

    it("Flags modules that are orphans if they're in the 'allowed' section", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.allowed.json"),
                {source: "something", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "not-in-allowed", severity: "warn"}]});
    });

    it("Leaves modules that are orphans, but that don't match the rule path", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.path.json"),
                {source: "something", "orphan": true}
            )
        ).to.deep.equal({valid: true});
    });

    it("Flags modules that are orphans and that match the rule's path", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.path.json"),
                {source: "noorphansallowedhere/blah/something.ts", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-orphans", severity: "error"}]});
    });

    it("Leaves modules that are orphans, but that do match the rule's pathNot", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.pathnot.json"),
                {source: "orphansallowedhere/something", "orphan": true}
            )
        ).to.deep.equal({valid: true});
    });

    it("Flags modules that are orphans, but that do not match the rule's pathNot", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.pathnot.json"),
                {source: "blah/something.ts", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-orphans", severity: "warn"}]});
    });

    it("The 'dependency' validation leaves the module only orphan rule alone", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.path.json"),
                {source: "noorphansallowedhere/something.ts", "orphan": true},
                {}
            )
        ).to.deep.equal({valid: true});
    });

});
