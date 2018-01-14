var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = 'mongodb://localhost:27017/TodoApp';

mongoose.connect(url,{useMongoClient:true}).then(
    (ok)=>{
        console.log('Connected to db');
    },
    (error)=>{
        console.log('error connecting to db');
    }
);

module.export = {mongoose};