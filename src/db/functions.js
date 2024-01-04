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
        {$limit: numPosts},
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
                likes: 1,
                comments: 1,
                createdAt: 1,
                'author.username': 1,
                'author.fullname': 1
            }
        }
    ]);
}

async function likePost(postId, userId) {
    return Post.updateOne({_id: postId}, {$push: {likes: userId}});
}

export {createUser, createPost, getPosts, likePost}
