const {Schema, model  } = require("mongoose");

const ArticulosSchema = Schema({
    name:{
        type:String,
        required:true
    }
    ,contenido:{
        type:String,
        required:true
    },fecha:{
        type:Date,
        default:Date.now
    },
    imagen:{
        type:String,
        default:"defauld.png"
    }
})
module.exports = model("User",ArticulosSchema, "user")