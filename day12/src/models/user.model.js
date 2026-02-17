let mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
    name : String , 
    email : {
        type : String , 
        unique : [true , "Email already exixts"]
    } , 
    password : String , 
});



let userModel = mongoose.model('users',userSchema);

module.exports = userModel ; 