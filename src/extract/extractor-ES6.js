"use strict";

const walk        = require('acorn/dist/walk');

exports.extract = (pAST, pDependencies) => {
    function pushSourceValue(pNode){
        if (pNode.source && pNode.source.value){
            pDependencies.push({
                moduleName: pNode.source.value,
                moduleSystem: "es6"
            });
        }
    }

    walk.simple(
        pAST,
        {
            "ImportDeclaration"     : pushSourceValue,
            "ExportAllDeclaration"  : pushSourceValue,
            "ExportNamedDeclaration": pushSourceValue
        }
    );
};
