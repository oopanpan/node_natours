const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'password cannot be blank'],
        minlength: [8, 'password needs to be 8 or more characters'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        //! CUSTOM VALIDATOR ONLY WORK ON .save()
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Both passwords should be matching',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

//* ENCRYPTION
userSchema.pre('save', async function (next) {
    //? Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //* CPU intensiveness for using, String will give salt
    this.password = await bcrypt.hash(this.password, 12);

    //? Delete the passwordConfirmed
    this.passwordConfirm = undefined;
});

//* instance method
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        console.log(changedTimestamp, JWTTimestamp);
        //! JTW token is issued after the data is set,the return will be true if the password was changed
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
