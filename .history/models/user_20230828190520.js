const {Schema, model  } = require("mongoose");

const userSchema = Schema({
 
    name:{
        type:String,
        required:true
    }
    ,nick:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    id:{
        type:number,
        required:true
    }
    ,
    password:{
        type:number,
        required:true
    }
    ,
    role:{
        type:String,
        default:"role_user"
    },
    imagen:{
        type:String,
        default:"defauld.png"
    }
})
module.exports = model("User",userSchema, "user")