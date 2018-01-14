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
            console.log('Todo saved');
            res.send(doc).status(200);
        },
        (error)=>{
            console.log('Error saving the todo');
            res.status(400).send('Error');
        }
    );
    
});

app.listen(5000,()=>{
    console.log('Connected to port 5000');
});

module.exports = {app};