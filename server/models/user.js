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
    },
    age:{
        type: Number,
        required:true,
        minlength:1,
        trim:true
    }
});

module.exports.User = User;