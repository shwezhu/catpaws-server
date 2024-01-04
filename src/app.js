import express from 'express';
import mongoose from "mongoose";
import {handleRegister, handleLogin, handleLogout} from "./handlers/auth.js";
import {getMulter, isAuthenticated, setMiddlewares} from "./middleware/functions.js";
import {handleCreatePost, handleGetPosts, handleLikePost} from "./handlers/post.js";

const upload = getMulter();
const app = express();

async function main() {
    await mongoose.connect('mongodb://localhost:27017/catpaws', {
        serverSelectionTimeoutMS: 2000,
    });

    setMiddlewares(app);

    // Auth Routes.
    app.post('/api/users/register', handleRegister);
    app.post('/api/users/login', handleLogin);
    app.post('/api/users/logout', isAuthenticated, handleLogout);

    // Post Routes.
    app.post('/api/posts/create', isAuthenticated, upload.array('file', 6), handleCreatePost);
    app.get('/api/posts', isAuthenticated, handleGetPosts);
    app.post('/api/posts/:post_id/like', isAuthenticated, handleLikePost);

    app.listen(6666, () => {
        console.log('Server listening on port 6666');
    });
}

main().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});