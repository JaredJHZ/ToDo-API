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
    var token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();
    user.tokens.push({access,token});
    return user.save().then(()=> {
        return token;
    });
}

UserSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try{
        decoded = jwt.decode(token,'abc123');
    }catch(e){
        return Promise.reject();
    }
    return User.findOne(
        {'_id':decoded._id, 
        'tokens.token':token
        ,'tokens.access':'auth'});
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