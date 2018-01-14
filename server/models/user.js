const mongoose = require('mongoose');
var User = mongoose.model('user',{
    user:{
        type:String
    },
    email:{
        type:String,
        require: true,
        trim:true,
        minlength: 1
    }
});

module.exports.User = User;