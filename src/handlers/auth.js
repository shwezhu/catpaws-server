import User from "../models/user.js";
import {createUser} from "../db/functions.js";


// todo: hash password
function register(req, res) {
    const {fullname, username, password, email} = req.body;
    if (!fullname || !username || !password) {
        res.status(400).json({message: "register: missing credentials or basic info"});
        return;
    }

    User.findOne({username: username})
        .then(
            (doc) => {
                if (doc) {
                    res.status(400).json({message: "register: username already exists"});
                    return;
                }

                createUser(fullname, username, password)
                    .then(
                        (doc) => {
                            res.status(201).json({message: "register: user created successfully"});
                        }
                    )
                    .catch(
                        (err) => {
                            console.error('register:', err);
                            res.status(500).json({message: `register: ${err}`});
                        }
                    )
            }
        )
}

// todo: hash password
function login(req, res) {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).json({message: "login: missing credentials"});
        return;
    }

    User.findOne({username: username})
        .then(
            (doc) => {
                if (!doc || doc.password !== password) {
                    res.status(400).json({message: "login: credentials invalid"});
                    return;
                }

                req.session.isAuthenticated = true;
                res.status(200).json({userID: doc._id});
            }
        )
        .catch(
            (err) => {
                console.error('login:', err);
                res.status(500).json({message: "login: internal error"});
            }
        )
}

function logout(req, res) {
    req.session.destroy();
    res.status(200).json({message: "logout: user logged out successfully"});
}

export {register, login, logout};