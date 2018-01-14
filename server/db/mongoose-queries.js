const {mongoose} = require('./db');
const {User} = require('../models/user');

let Jared = new User({
    user:'Jared',
    email:'asdas@gmail.com'
});


User.findById("5a5aea98df99a0163865d48d").then(
    (ok)=>{
        if(!ok){
            return console.log('Error');
        }
        console.log('User found');
        console.log(ok);
    }
).catch((error)=> console.log('Error'));

