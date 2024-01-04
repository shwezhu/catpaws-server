import {createPost, getPosts, getUserByID} from "../db/functions.js"


function handleCreatePost(req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const filePaths = req.files.map((file) => file.path);
    createPost(id, text, filePaths)
        .then(
            (doc) => {
                res.status(201).json({message: "post created successfully"})
            }
        )
        .catch(
            (err) => {
                res.status(500).json({message: `internal error: ${err}`});
            }
        )
}

async function handleGetPosts(req, res) {
    const postId = req.params.id;
    const userId = req.session.userId;
    
}

async handleLikePost(req, res) {
    const id = req.params.id;
    const post_id = req.params.post_id;
    try {
        const user = await getUserByID(id);
        const post = await getPostByID(post_id);
        post.likes.push(user);
        await post.save();
        res.status(200).json({message: "post liked successfully"});
    } catch (err) {
        res.status(500).json({message: `internal error: ${err}`});
    }
}

export {handleCreatePost, handleGetPosts};