const Follow = require("../models/follow")

const followUserIds = async(identityUserId)=>{
    try {
        // Sacar info de seguimientos de los usuarios
        let following = await Follow.find({"user":identityUserId}).select({"followed":1, "_id":0}).exec();
        let followers =  await Follow.find({"folled":identityUserId}).select({"user":1, "_id":0}).exec();

        // Procesar array de identificadores
        let followingClean = [];
        following.forEach(follow=>{
            followingClean.push(follow.followed);
        })

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