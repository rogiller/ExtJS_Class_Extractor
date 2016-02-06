//require some needed stuff
var acorn = require("acorn");
var fs = require('fs');
var util = require('util');

//do an IIFE to start fire off extraction (just for fun :) )
(function doExtraction(){

    if(process.argv.length < 3){
        console.log("Please pass the ExtJS file to parse as an argument.")
        return;
    }

    var extJSFilePath = process.argv[2];

    var contents = fs.readFileSync(extJSFilePath, 'utf8');

    var esTree = acorn.parse(contents, null);

    if(isProgram(esTree)){

        var body = esTree.body;

        var result = {};
        var classes = [];

        result.classes = classes;

        for (var i = 0; i < esTree.body.length; i++) {

            var bodyObj = esTree.body[i];

            if(isClass(bodyObj)){
                classes.push(toClassObject(bodyObj));
            }
        }

        console.log(util.inspect(result, {showHidden: false, depth: null}));
    }

})();

function isProgram(esTree){
    return esTree.type == 'Program';
}

function isClass(bodyObj){

    if(bodyObj.type == 'ExpressionStatement' && bodyObj.expression.callee.object.name == 'Ext' &&
        bodyObj.expression.callee.property.name == 'define'){

        return true;
    }

    return false;
}

function toClassObject(bodyObj){

    var defObj = bodyObj.expression.arguments[1];

    var fields = [];
    var methods = [];

    for(var j = 0; j < defObj.properties.length; j++){

        var prop = defObj.properties[j];

        if(prop.value.type == 'FunctionExpression'){
            fields.push({ name : prop.key.name});
        }else{
            methods.push({ name : prop.key.name});
        }
    }

    var classObj = {};
    classObj.name = bodyObj.expression.arguments[0].value;
    classObj.fields = fields;
    classObj.methods = methods;

    return classObj;
}


