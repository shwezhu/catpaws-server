import User from "../models/user.js";
import Post from "../models/post.js";

async function createUser(username, password) {
    const newUser = new User({
        username: username,
        password: password,
    });

    await newUser.save();
}

async function createPost(userId, text, images) {
    const newPost = new Post({
        userId: userId,
        text: text,
        images: images,
        visibalTo: [userId],
    });

    await newPost.save();
}

async function getPosts(numPosts) {
    return Post.find().limit(numPosts);
}

export {createUser, createPost, getPosts}
