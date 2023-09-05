const {Schema, model  } = require("mongoose");

const ArticulosSchema = Schema({
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
    },
    imagen:{
        type:String,
        default:"defauld.png"
    }
})
module.exports = model("User",ArticulosSchema, "user")