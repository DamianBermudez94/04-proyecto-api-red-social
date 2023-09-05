const {Schema, model  } = require("mongoose");

const userSchema = Schema({
    id:{
        type:String,
        required:true
    }
    ,
    name:{
        type:String,
        required:true
    }
    ,nick:{
        type:String,
        required:true
    },id:{
        type:number,
        required:true
    }
    ,
    password:{
        type:number,
        required:true
    }
    ,
    imagen:{
        type:String,
        default:"defauld.png"
    },
    imagen:{
        type:String,
        default:"defauld.png"
    }
})
module.exports = model("User",ArticulosSchema, "user")