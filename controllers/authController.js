const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //? Require email and password
    if (!email || !password) {
        return next(new AppError('Email or password cannot be blank', 400));
    }

    //? Check user entity and password correctness
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or password', 401));
    }

    const token = signToken(user._id);
    //? sned json back
    res.status(200).json({
        status: 'success',
        token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
        token = auth.split(' ')[1];
    }
    console.log(token);
    if (!token) {
        return next(new AppError('Please Login or Signup', 401));
    }
    next();
});
