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

        let followersClean = [];
        following.forEach(follow=>{
            followersClean.push(follow.user);
        })

        return{
            following,
            followers
        }
    } catch (error) {
        return{}
    }
}
const followThisUser = async (identityUserId, profileUserId)=>{
    // Sacar info de seguimientos de los usuarios
    let following = await Follow.findOne({"user":identityUserId, "followed":profileUserId});
    //let follower =  await Follow.findOne({"user":profileUserId,"follwed":identityUserId});

    console.log(following);
    return{
        following,
        
    }
}
module.exports={
    followUserIds,
    followThisUser
  
}