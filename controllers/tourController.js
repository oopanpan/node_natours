const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//* custom middleware to validate id
exports.checkID = (req, res, next, val) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }
    next();
};

//* custom middleware to validate body content
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Tour name and price cannot be blank',
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestAt: req.requestTime,
        result: tours.length,
        data: { tours },
    });
};

exports.createTour = (req, res) => {
    //?this is how to check the body from the request
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    //? CREATE A NEW OBJECT, INJECTING IDs
    //* ES5
    // const newTour = Object.assign({ id: newId }, req.body);
    //* ES6
    const newTour = { ...req.body, id: newId };
    tours.push(newTour);
    //? use Async
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            //* 200 means OK, 201 means CREATED!!!
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

exports.getTour = (req, res) => {
    //* cool stuff to do str to int conversion
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
};

exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
};

exports.deleteTour = (req, res) => {
    //? mongoDB where are you
    //? status 204, NO CONTENT SUCCESS
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
