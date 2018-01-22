const mongoose = require('mongoose');
const validator = require('validator');
const {Schema} = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new Schema({
    user:{
        type:String
    },
    email:{
        type:String,
        required: true,
        trim:true,
        minlength: 1,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: " is not an email"
        }
    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
    
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['user','_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(), access},process.env.JWT_KEY).toString();
    user.tokens.push({access,token});
    return user.save().then(()=> {
        return token;
    });
}

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull:{ 
            tokens:{token}
        }
    })
}

UserSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try{
        decoded = jwt.decode(token,process.env.JWT_KEY);
    }catch(e){
        return Promise.reject();
    }
    if(!decoded){
        return Promise.reject();
    }
    return User.findOne(
        {'_id':decoded._id, 
        'tokens.token':token
        ,'tokens.access':'auth'});
}

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;
    return User.findOne({email}).then(
        (user)=>{
            if(!user){
              return  Promise.reject();
            }
            return new Promise((resolve,reject)=>{
                bcrypt.compare(password,user.password,(err,res)=>{
                    if(err){
                        reject();
                    }else{
                        resolve(user);
                    }
                })
            });
        }
    );
}

UserSchema.pre('save',function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            if(err){
                console.log('error');
            }else{
                bcrypt.hash(user.password,salt,(err,hash)=>{
                    user.password = hash;
                    next();
                });
            }
        })
    }else next();
});

var User = mongoose.model('user',UserSchema);



module.exports.User = User;