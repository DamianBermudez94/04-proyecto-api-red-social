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
    bio:{
        type:String
    },
    password:{
        type:String,
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
    ,
    create_at:{
        type:Date,
        default:Date.now
    }
})
module.exports = model("User",userSchema, "users")