import express from 'express';
import mongoose from "mongoose";
import path from "node:path";
import {register, login, logout} from "./handlers/auth.js";
import {getMulter, validateCredentials, isAuthenticated, setMiddlewares} from "./middleware/functions.js";
import {handleCreatePost, handleGetPosts} from "./handlers/post.js";

const upload = getMulter();
const app = express();

async function main() {
    await mongoose.connect('mongodb://localhost:27017/catpaws', {
        serverSelectionTimeoutMS: 2000,
    });

    setMiddlewares(app);

    app.get('/', isAuthenticated, (req, res) => {
        res.status(500).json({message: "this is the home page"});
    });

    // Auth Routes.
    app.post('/auth/register', validateCredentials, register);
    app.post('/auth/login', validateCredentials, login);
    app.post('/auth/logout', logout);

    // Post Routes.
    app.post('/posts/:id/new', isAuthenticated, upload.array('file', 6), handleCreatePost);
    app.get('/posts/:id', isAuthenticated, handleGetPosts);

    app.listen(6666, () => {
        console.log('Server listening on port 6666');
    });
}

main().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});