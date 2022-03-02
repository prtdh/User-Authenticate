const mongoose =require('mongoose')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        max:255
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:1024
    }
})
module.exports=mongoose.model('User',userSchema)