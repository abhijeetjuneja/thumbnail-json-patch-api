var mongoose = require('mongoose');
var express = require('express');
mongoose.Promise = require('bluebird');

// express router // used to define routes 
var thumbnailRouter  = express.Router();
var jimp = require("jimp");
var jwt = require('jsonwebtoken');
var path = require('path');
var domain = require('./../../config/config').domain;
var responseGenerator = require('./../../libs/responseGenerator');
var detail = require('./../../middlewares/getDetails');
var randomString = require('random-string');



module.exports.controllerFunction = function(app) {

    //Create thumbnail
    thumbnailRouter.post('/create',detail.getDetails,function(req,res){

        //Verify body parameters
        if(req.body.url!=undefined){

            jimp.read(req.body.url, function (err, image) {
                // do stuff with the image (if no exception) 
                if (err){
                    var myResponse = responseGenerator.generate(true,'Invalid Url',401,null,null);
                    res.status(401).json(myResponse);
                }
                else
                {
                    var x = randomString({
                      length: 8,
                      numeric: false,
                      letters: true,
                      special: false,
                    });
                    image.resize(50,50).write(path.join(__dirname, './../../public/images' , x+'.jpg'));
                    var thumbnailPath = 'http://' + domain + path.join('/public/images' , x+'.jpg');
                    res.status(200).json({error:false,message:'Thumbnail Generated',status:200,token:null,data:thumbnailPath});
                }
            });

            


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
        

    });//end create

    

    //name api
    app.use('/thumbnails', thumbnailRouter);



 
};//end contoller code
