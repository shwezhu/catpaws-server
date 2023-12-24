import User from "../models/user.js";
import {createUser} from "../db/functions.js";


// todo: hash password
function register(req, res) {
    const {username, password} = req.body;
    User.findOne({username: username})
        .then(
            (doc) => {
                if (doc) {
                    res.status(400).json({message: "register: username already exists"});
                    return;
                }

                createUser(username, password)
                    .then(
                        (doc) => {
                            res.status(201).json({message: "register: user created successfully"});
                        }
                    )
                    .catch(
                        (err) => {
                            console.error('Error creating user:', err);
                            res.status(500).json({message: "register: internal error"});
                        }
                    )
            }
        )
}

// todo: hash password
function login(req, res) {
    const {username, password} = req.body;
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
    res.status(200).json({message: "logout: user logged out successfully"});
}

export {register, login, logout};