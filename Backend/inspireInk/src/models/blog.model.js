import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const Blog = mongoose.model('Blog', blogSchema);