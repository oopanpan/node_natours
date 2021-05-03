const express = require('express');
//? a middleware that log response
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//! USING MIDDLEWARE for POST REQUEST
app.use(express.json());
//! CUSTOM MIDDLEWARE, the third argument in the callback is always the next
//! and always call next() at the end of the middleware, otherwise the app will be stuck
app.use((req, res, next) => {
    console.log('---Message from CUSTOM MIDDLEWARE---');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 3) Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 4) Start Server
module.exports = app;
