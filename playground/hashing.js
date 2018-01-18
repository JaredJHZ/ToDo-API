const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken');


let data = {
    id : 10
};

let token = jwt.sign(data,'atleti123');

jwt.verify(token, 'atleti123');

console.log(jwt.verify(token, 'atleti123'));

console.log(token);

/*
var message = 'I am user numer 1';

var hash = SHA256(message).toString();

let password='atleti';

let data = {
    id: 5
};

let token ={
    data,
    hash: SHA256(JSON.stringify(data)+password).toString() 
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

let resultHAsh = SHA256(JSON.stringify(data)+password).toString();

if(resultHAsh === token.hash){
    console.log('Data was not changed');
}else console.log('Dont trust the data was changed');
*/

