const fs = require('fs');
const express = require('express');

const app = express();

//! USING MIDDLEWARE for POST REQUEST
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//! REFRACTOR ! dry dry dry
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: { tours },
    });
};

const createTour = (req, res) => {
    //?this is how to check the body from the request
    //   console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    //? CREATE A NEW OBJECT, INJECTING IDs
    //* ES5
    // const newTour = Object.assign({ id: newId }, req.body);
    //* ES6
    const newTour = { ...req.body, id: newId };
    tours.push(newTour);
    //? use Async
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
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

const getTour = (req, res) => {
    //? this is how to check the params from the request
    // console.log(req.params);

    //? JSON value is always a string, remember to convert them into int
    // const id = parseInt(req.params.id);
    //* cool stuff to do str to int conversion
    const id = req.params.id * 1;
    const tour = tours.find((tour) => tour.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'not found',
            message: 'tour not found',
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((tour) => tour.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    //? fancy stuff to replace the data with data from params
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
};

const deleteTour = (req, res) => {
    //? mongoDB where are you
    //? status 204, NO CONTENT SUCCESS
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
//? ROUTE HANDLER
// //* index
// app.get('/api/v1/tours', getAllTours);
// //* create
// app.post('/api/v1/tours', createTour);
// //* show
// app.get('/api/v1/tours/:id', getTour);
// //* update
// app.patch('/api/v1/tours/:id', updateTour);
// //* delete
// app.delete('api/v1/tours/:id', deleteTour);
//* CHAINING requests using .route()
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
