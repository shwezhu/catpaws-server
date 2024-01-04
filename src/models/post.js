import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    visibleTo: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    text: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    comments: {
        type: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

export default Post;