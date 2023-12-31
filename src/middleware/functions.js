import fs from "fs";
import cors from 'cors';
import multer from "multer";
import path from "node:path";
import express from "express";
import session from "express-session";

function setMiddlewares(app) {
    app.use(cors());
    // Parse request body into req.body, if request has Content-Type: application/json.
    app.use(express.json());
    // Parse request body into req.body, if request has Content-Type: application/x-www-form-urlencoded.
    app.use(express.urlencoded({extended: true}));
    // Enable sessions.
    app.use(session({
        secret: 'your_secret_key',
        resave: true,
        saveUninitialized: true,
        cookie: {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true, // The cookie only accessible by the web server.
            secure: false,
        }
    }));
}

function getMulter(req, res, next) {
    const media_dir = './uploads';

    if (!fs.existsSync(media_dir)){
        fs.mkdirSync(media_dir);
    }

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, media_dir);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = file.fieldname + '-' + Date.now();
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    return multer({ storage: storage });
}

function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated && req.session.userId) {
        return next();
    }

    res.status(401).json({error: "auth: not authenticated"});
}

export { getMulter, isAuthenticated, setMiddlewares };
