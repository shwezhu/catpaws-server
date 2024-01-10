import {commentPost, createPost, deletePost, getPost, getPosts, likePost} from "../db/functions.js"

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

async function handleDeletePost(req, res) {
    try {
        await deletePost(req.params.post_id, req.session.userId);
        res.status(200).json({message: "ok"});
    } catch (err) {
        res.status(500).json({error: `handleDeletePost: internal error: ${err}`});
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

async function handleGetPost(req, res) {
    try {
        const post = await getPost(req.params.post_id, req.session.userId);
        post[0].comments.sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json(post[0]);
    } catch (err) {
        res.status(500).json({error: `handleGetPost: internal error: ${err}`});
    }
}

async function handleCommentPost(req, res) {
    try {
        const post = await commentPost(req.params.post_id, req.session.userId, req.body.content);
        res.status(200).json(post.comments[post.comments.length-1]);
    } catch (err) {
        res.status(500).json({error: `handleGetPost: internal error: ${err}`});
    }
}

export {handleCreatePost, handleGetPosts, handleGetPost, handleCommentPost, handleDeletePost, handleLikePost};