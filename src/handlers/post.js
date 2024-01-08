import {createPost, getPosts, likePost} from "../db/functions.js"

async function handleCreatePost(req, res) {
    const userId = req.session.userId;
    const text = req.body.text;
    const filePaths = req.files.map((file) => file.path);

    try {
        await createPost(userId, text, filePaths);
        res.status(201).json({message: "ok"})
    } catch (err) {
        res.status(500).json({error: `handleCreatePost: internal error: ${err}`});
    }
}

async function handleGetPosts(req, res) {
    try {
        const posts = await getPosts(req.session.userId, 20);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({error: `handleGetPosts: internal error: ${err}`});
    }
}

async function handleLikePost(req, res) {
    /** @namespace req.params.post_id */
    const postId = req.params.post_id;
    const userId = req.session.userId;
    try {
        await likePost(postId, userId);
        res.status(200).json({message: "ok"});
    } catch (err) {
        res.status(500).json({error: `handleLikePost: internal error: ${err}`});
    }
}

export {handleCreatePost, handleGetPosts, handleLikePost};