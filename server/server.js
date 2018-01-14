var express = require('express');
var bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var mongoose = require('./db/db');
var {Todo} = require('./models/ToDo');
var {User} = require('./models/user');

const port = process.env.PORT || 5000;

var app = express();



app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    
    todo.save().then(
        (doc)=>{
            res.send(doc);
        },
        (e)=>{
            res.status(400).send(e);
        }
    );
    
});

app.get('/todos',(req,res)=>{
    Todo.find({}).then(
        (docs)=>{
           res.status(200).send({docs});
        }
    ).catch((error)=>{
        console.log(error);
    });
});

app.get('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectId.isValid(id)){
       return res.send('Id not valid');
    }
    Todo.findById(id).then(
        (doc)=>{
            if(!doc){
                res.status(400).send('Error id not found');
            }else{
                res.send(doc);
            }
        }
    ).catch((error)=>{res.status(404).send('Error in process')});

});

app.listen(port,()=>{
    console.log('Connected to port: '+port);
});

module.exports = {app};