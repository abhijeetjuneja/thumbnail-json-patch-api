var mongoose = require('mongoose');
var express = require('express');
mongoose.Promise = require('bluebird');

// express router // used to define routes 
var jsonPatchRouter  = express.Router();
var jimp = require("jimp");
var jwt = require('jsonwebtoken');
var path = require('path');
var domain = require('./../../config/config').domain;
var responseGenerator = require('./../../libs/responseGenerator');
var json = require('./../../libs/json');
var detail = require('./../../middlewares/getDetails');
var randomString = require('random-string');
var jsonpatch = require('jsonpatch');



module.exports.controllerFunction = function(app) {

    //Apply json patch
    jsonPatchRouter.post('/apply',detail.getDetails,function(req,res){

        var s= "'" + JSON.stringify(req.body.json) + "'";
        //Verify body parameters
        if(req.body.json!=undefined && req.body.jsonPatch!=undefined){

            //Check if jsonpatch is valid
            if(!Array.isArray(req.body.jsonPatch))
            {
                var myResponse = responseGenerator.generate(true,"Invalid Json Patch",401,null,null);
                res.status(401).json(myResponse);
            }

            //Check if json is valid
            else if(json.isJson(s) && typeof req.body.json == 'object')
            {
                try{
                    var result = jsonpatch.apply_patch(req.body.json,req.body.jsonPatch);
                } catch(e){
                    var myResponse = responseGenerator.generate(true,"Invalid Json Patch",401,null,null);
                    res.status(401).json(myResponse);
                }
                var result = jsonpatch.apply_patch(req.body.json,req.body.jsonPatch);
                var myResponse = responseGenerator.generate(false,"Json Patched",200,null,result);
                res.status(200).json(myResponse);
            }
            else
            {
                var myResponse = responseGenerator.generate(true,"Invalid Json",401,null,null);
                res.status(401).json(myResponse);
            }
            

        }
        //Form fields not filled up
        else{
            var myResponse = {
                error: true,
                message: "Please fill up all the fields",
                status: 400,
                data: null
            };

            res.status(400).json(myResponse);

        }
        

    });//end apply

    

    //name api
    app.use('/jsonpatch', jsonPatchRouter);



 
};//end contoller code
