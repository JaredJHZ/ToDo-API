const {User} = require('../models/user');

var authenticate = (req,res,next) =>{
    let token = req.header('x-auth');
    if(token === undefined){
        res.status(401).send();
    }
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject('user not found');
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send(); 
    });
}

module.exports.authenticate = authenticate;