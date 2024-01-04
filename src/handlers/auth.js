import User from "../models/user.js";
import {createUser} from "../db/functions.js";


// todo: hash password
async function handleRegister(req, res) {
    const {fullname, username, password, email} = req.body;
    if (!fullname || !username || !password) {
        res.status(400).json({error: "register: missing credentials or basic info"});
        return;
    }

    try {
        const query = await User.findOne({username: username}, null, null );
        if (query) {
            res.status(400).json({error: "register: username already exists"});
            return;
        }
        await createUser(fullname, username, password, email);
    } catch (err) {
        console.error('register:', err);
        res.status(500).json({error: `register: ${err}`});
    }
}

// todo: hash password
async function handleLogin(req, res) {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).json({error: "login: missing credentials"});
        return;
    }

    try {
        const query = await User.findOne({username: username}, null, null );
        if (!query) {
            res.status(400).json({error: "login: credentials invalid"});
            return;
        }
        req.session.isAuthenticated = true;
        /** @namespace query._id */
        req.session.userId = query._id;
        res.status(200).json({message: "ok"});
    } catch (error) {
        console.error('login:', error);
        res.status(500).json({error: "login: internal error"});
    }
}

function handleLogout(req, res) {
    req.session.destroy();
    res.status(200).json({message: "logout: user logged out successfully"});
}

export {handleRegister, handleLogin, handleLogout};