const {Schema, model  } = require("mongoose");

const followsSchema = Schema({
 
    user:{
        type:Schema.ObjectId,
        ref:"User"
    }
    ,followed:{
        type:Schema.ObjectId,
        ref:"User"
    },
    create_at:{
        type:Date,
        default:Date.now
    }
   
})
module.exports = model("Follow",followsSchema, "follows");