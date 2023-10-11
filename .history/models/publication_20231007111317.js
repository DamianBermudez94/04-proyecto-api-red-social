const {Schema, model  } = require("mongoose");

const PublicationSchema = Schema({
 
    text:{
        type: Schema.String,
        require: true
    },
    file:String,
    create_at:{
        type:Date,
        default:Date.now
    }
   
})
module.exports = model("Publication",PublicationSchema, "publication");