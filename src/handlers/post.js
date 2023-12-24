import {createPost, getPosts} from "../db/functions.js"


function handleCreatePost(req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const filePaths = req.files.map((file) => file.path);
    createPost(id, text, filePaths)
        .then(
            (doc) => {
                res.status(201).send('post created successfully.');
            }
        )
        .catch(
            (err) => {
                res.status(500).json({message: `internal error: ${err}`});
            }
        )
    console.log(`user ${id} created post with text ${text} and files ${filePaths}`);
}

async function handleGetPosts(req, res) {
    try {
        const posts = await getPosts(10);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({message: `internal error: ${err}`});
    }
}

export {handleCreatePost, handleGetPosts};