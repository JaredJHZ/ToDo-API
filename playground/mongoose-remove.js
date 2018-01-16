const {mongoose} = require('../server/db/db');
const {ObjectId} = require('mongodb');

const {Todo} = require('../server/models/ToDo');
const {User} = require('../server/models/user');


User.remove({}).then(
    (ok)=>{
        console.log(ok.result.ok);
    }
);

todo1 = new Todo;
todo1.text = "Play some videogames";

todo1.save().then((ok)=>console.log(ok));

Todo.findByIdAndRemove('5a5d6941d882685d98b5edcf').then(
    (ok)=>{
        console.log(ok);
    }
);
