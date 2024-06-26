const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type:String,
    require:true
  },
  nick: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "role_user",
  },
  image: {
    type: String,
    default: "defauld.png",
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(mongoosePaginate);
module.exports = model("User", userSchema, "users");
