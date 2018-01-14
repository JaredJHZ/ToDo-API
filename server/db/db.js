var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = {localhost:'mongodb://localhost:27017/TodoApp',mlab:"mongodb://jared:atleti123@ds046267.mlab.com:46267/todos"
};

mongoose.connect(url.mlab||url.localhost,{useMongoClient:true}).then(
    (ok)=>{
        console.log('Connected to db');
    },
    (error)=>{
        console.log('error connecting to db');
    }
);


module.export = {mongoose};