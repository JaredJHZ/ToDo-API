var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/db');
var {Todo} = require('./models/ToDo');
var {User} = require('./models/user');

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

app.listen(5000,()=>{
    console.log('Connected to port 5000');
});

module.exports = {app};