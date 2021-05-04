//! SEEDING DATABASE SCRIPT

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('DB connection successful!');
    });

//? READ JSON FILE
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//? IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data imported');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

//? DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

//! THIS CREATE A COMMAND LIND FLAG ACCESS
if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
