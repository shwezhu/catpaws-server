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

async function getUserByID(userID) {
    return User.findById(userID);
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

async function getPosts(userId, numPosts) {
    try {
        const visiblePosts = await Post.aggregate([
            { $match: { visibalTo: userId } },
            { $limit: numPosts },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            { $unwind: '$creator' }, // $lookup returns an array, we need to unwind it
            {
                $project: {
                    text: 1,
                    images: 1,
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                    'creator.username': 1,
                    'creator.fullname': 1
                }
            }
        ]);

        return visiblePosts;
    } catch (error) {
        console.error('getPosts: ', error);
        throw error;
    }
}

export {createUser, getUserByID, createPost, getPosts}
