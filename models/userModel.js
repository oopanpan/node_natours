const mongoose = require('mongoose');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: [true, 'This username is used'],
        trim: true,
        maxlength: [40, 'username cannot be more than 40 characters'],
        minlength: [3, 'username cannot be less than 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'this email has already been registered'],
        trim: true,
    },
    password: String,
    passwordConfirm: String,
});

module.exports = userSchema;
