//require some needed stuff
var acorn = require("acorn");
var fs = require('fs');
var util = require('util');

//do an IIFE to start fire off extraction (just to keep variables inside a function scope)
(function doExtraction(){

    if(process.argv.length < 3){
        console.log("Please pass the ExtJS file to parse as an argument.")
        return;
    }

    var extJSFilePath = process.argv[2];

    var extJSFileContents = fs.readFileSync(extJSFilePath, 'utf8');

    var esTree = acorn.parse(extJSFileContents, null);

    if(isProgram(esTree)){

        var bodyArray = esTree.body;

        var result = {};
        var classes = [];

        result.classes = classes;

        for (var i = 0; i < bodyArray.length; i++) {

            var bodyChunk = bodyArray[i];

            if(isExtJSClass(bodyChunk)){
                classes.push(toClassObject(bodyChunk));
            }
        }

        console.log(util.inspect(result, false, null));
    }

})();

function isProgram(esTree){
    return esTree.type === 'Program';
}

function isExtJSClass(bodyChunk){

    if(bodyChunk.type === 'ExpressionStatement' && bodyChunk.expression.callee.object.name === 'Ext' &&
        bodyChunk.expression.callee.property.name === 'define'){

        return true;
    }

    return false;
}

function toClassObject(bodyChunk){

    var props = bodyChunk.expression.arguments[1].properties;

    var fields = [];
    var methods = [];

    for(var i = 0; i < props.length; i++){

        var prop = props[i];

        if(prop.value.type === 'FunctionExpression'){
            methods.push({ name : prop.key.name});
        }else{
            fields.push({ name : prop.key.name});
        }
    }

    var classObj = {};
    classObj.name = bodyChunk.expression.arguments[0].value;
    classObj.fields = fields;
    classObj.methods = methods;

    return classObj;
}


