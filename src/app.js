import express from 'express';
import mongoose from "mongoose";
import {handleRegister, handleLogin, handleLogout} from "./handlers/auth.js";
import {getMulter, isAuthenticated, setMiddlewares} from "./middleware/functions.js";
import {
    handleCommentPost,
    handleCreatePost,
    handleDeletePost,
    handleGetPost,
    handleGetPosts,
    handleLikePost
} from "./handlers/post.js";

const upload = getMulter();
const app = express();

async function main() {
    await mongoose.connect('mongodb://localhost:27017/catpaws', {
        autoIndex: false,
        serverSelectionTimeoutMS: 2000,
    });

    setMiddlewares(app);

    // Auth Routes.
    app.post('/api/users/register', handleRegister);
    app.post('/api/users/login', handleLogin);
    app.post('/api/users/logout', isAuthenticated, handleLogout);

    // Post Routes.
    app.get('/api/posts', isAuthenticated, handleGetPosts);
    app.get('/api/posts/:post_id', isAuthenticated, handleGetPost);
    app.post('/api/posts/create', isAuthenticated, upload.array('file', 6), handleCreatePost);
    app.post('/api/posts/:post_id/delete', isAuthenticated, handleDeletePost);
    app.post('/api/posts/:post_id/like', isAuthenticated, handleLikePost);
    app.post('/api/posts/:post_id/comment', isAuthenticated, handleCommentPost);

    app.listen(6666, () => {
        console.log('Server listening on port 6666');
    });
}

main().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});