const fs = require('fs');
const express = require('express');

const app = express();

//! USING MIDDLEWARE for POST REQUEST
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello there this is our server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You may post to this endpoint...');
// });

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//? ROUTE HANDLER
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: { tours },
    });
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
