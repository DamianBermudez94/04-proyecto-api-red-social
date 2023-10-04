const Follow = require("../models/follow")

const followUserIds = async(identityUserId)=>{
    try {
        let following = await Follow.find({"user":identityUserId}).select({"followed":1, "_id":0}).exec();
        let followers =  await Follow.find({"folled":identityUserId}).select({"user":1, "_id":0}).exec();
        return{
            following,
            followers
        }
    } catch (error) {
        return{}
    }
}

module.exports={
    followUserIds,
  
}