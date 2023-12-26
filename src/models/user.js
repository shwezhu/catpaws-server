import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:false,
        unique:true
    }, 
    coupleId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
});

const User = mongoose.model('User', userSchema);

export default User;
