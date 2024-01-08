import mongoose from "mongoose";
import User from "../models/user.js";
import Post from "../models/post.js";

async function createUser(fullname, username, password, email) {
    const newUser = new User({
        fullname: fullname,
        username: username,
        password: password,
        email: email ? email : '',
    });

    await newUser.save();
}

async function createPost(userId, text, images) {
    const post = new Post({
        userId: userId,
        text: text,
        images: images,
        visibleTo: [userId],
    });

    await post.save();
}

async function getPosts(userId, numPosts) {
    return Post.aggregate([
        {$match: {visibleTo: new mongoose.Types.ObjectId(userId)}},
        {$sort: {createdAt: -1}},
        {$limit: numPosts},
        {
            $addFields: {
                engagement: {
                    numLikes: { $size: "$likes" },
                    numComments: { $size: "$comments" },
                    isLiked: { $in: [new mongoose.Types.ObjectId(userId), "$likes"] },
                }
            }
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'author'
            }
        },
        {$unwind: '$author'}, // $lookup returns an array, we need to unwind it
        {
            $project: {
                text: 1,
                images: 1,
                comments: 1,
                createdAt: 1,
                'author.username': 1,
                'author.fullname': 1,
                'author._id': 1,
                'engagement': 1,
            }
        },
    ]);
}

async function likePost(postId, userId) {
    const post = await Post.findOne({_id: postId}, null, null);
    if (!post) {
        throw new Error(`likePost: post ${postId} not found`);
    }
    /** @namespace post.likes */
    if (post.likes.includes(userId)) {
        return Post.updateOne({_id: postId}, {$pull: {likes: userId}});
    }

    return Post.updateOne({_id: postId}, {$push: {likes: userId}});
}

async function deletePost(postId, userId) {
    const res = await Post.deleteOne({_id: postId, userId: userId});
    console.log(res);
    /** @namespace res.acknowledged */
    if (!res.acknowledged) {
        throw new Error(`deletePost: post ${postId} not found for user ${userId}`);
    }
}

export {createUser, createPost, getPosts, deletePost, likePost}
