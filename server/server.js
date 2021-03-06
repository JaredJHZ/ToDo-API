require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');


var mongoose = require('./db/db');
var {Todo} = require('./models/ToDo');
var {User} = require('./models/user');
const authenticate = require('./middlewares/auth');

const port = process.env.PORT;

var app = express();



app.use(bodyParser.json());

app.post('/todos',authenticate.authenticate,(req,res)=>{
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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

app.get('/todos',authenticate.authenticate,(req,res)=>{
    Todo.find({
        _creator:req.user._id
    }).then(
        (docs)=>{
           res.status(200).send({docs});
        }
    ).catch((error)=>{
        console.log(error);
    });
});

app.get('/todos/:id',authenticate.authenticate,(req,res)=>{
    let id = req.params.id;
    if(!ObjectId.isValid(id)){
       return res.status(400).send('Id not valid');
    }
    Todo.findOne({
        _id:id,
        _creator:req.user.id
    }).then(
        (doc)=>{
            if(!doc){
                res.status(404).send('Error id not found');
            }else{
                res.send({doc});
            }
        }
    ).catch((error)=>{res.status(404).send('Error in process')});

});

app.delete('/todos/:id',authenticate.authenticate,(req,res)=>{
    let id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(400).send('Error Id invalid');
    }
    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then(
        (ok)=>{
            if(!ok){
                return res.status(404).send('Error document not found');
            }
            res.send({ok});
        }
    ).catch((error)=>res.status(400));

});

app.patch('/todos/:id',authenticate.authenticate,(req,res)=>{
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
    let query= {
        _id:id,
        _creator:req.user._id
    }
    Todo.findOneAndUpdate(query,{$set:body},{new: true}).then(
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

app.post('/users/',(req,res)=>{
    let body = _.pick(req.body,['user','email','password']);
    user = new User(body);
    user.save().then(()=>{
        return user.generateAuthToken();    
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(401).send({error:'parameters not valid'});
    });
});

app.get('/users/me',authenticate.authenticate,(req,res)=>{
    res.send(req.user);
    

});

app.post('/users/login',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    let email = body.email;
    let password = body.password;
    User.findByCredentials(email,password).then((user)=>{
        
        user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    
    }).catch((e)=>res.status(401).send());
   
});

app.delete('/users/me/token',authenticate.authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send('OK'),
        ()=>{
            res.status(400).send({});
        }
    });
});


app.listen(port,()=>{
    console.log('Connected to port: '+port);
});


module.exports = {app};