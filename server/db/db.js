var mongoose = require('mongoose');

mongoose.Promise = global.Promise;


mongoose.connect(process.env.MONGODB_URI,{useMongoClient:true}).then(
    (ok)=>{
        console.log('Connected to db');
    },
    (error)=>{
        console.log('error connecting to db');
    }
);


module.export = {mongoose};