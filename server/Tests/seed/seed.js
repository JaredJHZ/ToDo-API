const {ObjectId} = require('mongodb');
const {Todo} = require('../../models/ToDo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
var todos = [
    {
    _id: new ObjectId,
    text:'First text to do',
    completed:false,
    completedAt:null
    },
    {
        _id: new ObjectId(),
        text: 'Second to do',
        completed:true,
        completedAt: 555
    }

]

var users = [
    {
        _id: userOneId,
        user:'jaredgood',
        email: 'jaredgood@example.com',
        password: 'jared123',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        user:'bad',
        email:'hola@example.com',
        password:'asd123'

    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{
        done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();
        return Promise.all([user1,user2]);
    }).then(()=>done());
  };

module.exports = {todos,populateTodos,users,populateUsers};