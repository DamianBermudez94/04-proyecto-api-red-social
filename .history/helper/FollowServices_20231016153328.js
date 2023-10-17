const Follow = require("../models/follow");

const followUserIds = async (identityUserId) => {
  try {
    // Sacar info de seguimientos de los usuarios
    let following = await Follow.find({ "user": identityUserId })
      .select({ "followed": 1, "_id": 0 })
      .exec();
    let followers = await Follow.find({ "followed": identityUserId })
      .select({ "user": 1, "_id": 0 })
      .exec();

    // Procesar array de identificadores
    let followingClean = [];
    following.forEach((follow) => {
      followingClean.push(follow.followed);
    });

    let followersClean = [];
    following.forEach((follow) => {
      followersClean.push(follow.user);
    });

    return {
      following,
      followers,
    };
  } catch (error) {
    return {};
  }
};
const followThisUser = async (identityUserId, profileUserId) => {
  // Sacar info de seguimientos de los usuarios
  console.log(
    "Soy el id del usuario",
    identityUserId,
    "Soy el id del perfil del usuario",
    profileUserId
  );
  let following = await Follow.findOne({
    user: identityUserId,
    followed: profileUserId,
  });
  let follower = await Follow.findOne({
    user: profileUserId,
    followed: identityUserId,
  });

  console.log("soy los seguidos/los que sigo:", following, follower);
  return {
    following,
    follower,
  };
};
module.exports = {
  followUserIds,
  followThisUser,
};
