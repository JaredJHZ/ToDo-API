var env = process.env.NODE_ENV ||  'development';;

if(env==='development')
{
    process.env.PORT = 5000;
    process.env.MONGODB_URI= "mongodb://localhost:27017/TodoApp";
}else if(env === 'test'){
    process.env.PORT =5000;
    process.env.MONGODB_URI= "mongodb://localhost:27017/TodoAppTest";
}

console.log(env);   

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
var mongoose = require('./db/db');
var {Todo} = require('./models/ToDo');
var {User} = require('./models/user');

const port = process.env.PORT;

var app = express();



app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    
    todo.save().then(
        (doc)=>{
            res.send({doc});
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
       return res.status(400).send('Id not valid');
    }
    Todo.findById(id).then(
        (doc)=>{
            if(!doc){
                res.status(404).send('Error id not found');
            }else{
                res.send({doc});
            }
        }
    ).catch((error)=>{res.status(404).send('Error in process')});

});

app.delete('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(400).send('Error Id invalid');
    }
    Todo.findByIdAndRemove(id).then(
        (ok)=>{
            if(!ok){
                return res.status(404).send('Error document not found');
            }
            res.send({ok});
        }
    ).catch((error)=>res.status(400));

});

app.patch('/todos/:id',(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body, ['text','completed']);
    if(!ObjectId.isValid(id)){
        return res.status(400).send('Error Id invalid');
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new: true}).then(
        (todo)=>{
            if(!todo){
                res.status(400).send();
            }
            res.send({todo});
        }
    ).catch((e)=>{
        res.status(400).send();
    })
});



app.listen(port,()=>{
    console.log('Connected to port: '+port);
});

module.exports = {app};