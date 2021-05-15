const mongoose = require('mongoose');
const validator = require('validator');

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
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'invalid email format'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'password cannot be blank'],
        minlength: [8, 'password needs to be 8 or more characters'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        //! CUSTOM VALIDATOR ONLY WORK ON .save()
        validate: {
            validator: function (el) {
                return el === this.password;
            },
        },
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
