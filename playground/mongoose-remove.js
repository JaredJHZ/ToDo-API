const {mongoose} = require('../server/db/db');
const {ObjectId} = require('mongodb');

const {Todo} = require('../server/models/ToDo');
const {User} = require('../server/models/user');

/*
User.remove({}).then(
    (ok)=>{
        console.log(ok.result.ok);
    }
);
*/

todo1 = new Todo;
todo1.text = "Play some videogames";

todo1.save().then((ok)=>console.log(ok));

Todo.findByIdAndRemove('5a5c515f2faa0260ad4d0f94').then(
    (ok)=>{
        console.log(ok);
    }
);