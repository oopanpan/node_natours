const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less than or equal to 40 characer',
            ],
            minlength: [
                10,
                'A tour name must have more than or equal to 10 characer',
            ],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty scale'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.0,
            min: [1, 'rating must be between 1.0 to 5.0'],
            max: [5, 'rating must be between 1.0 to 5.0'],
        },
        ratingsQuantiy: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            // arrow function if don't need "this"
            validate: {
                // custom validator would only work on create not update
                validator: function (val) {
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be lower than the price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            //GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//? Cant use this virtual property in query because it's only computed in the backend not in the database
tourSchema.virtual('durationWeeks').get(function () {
    return Math.ceil(this.duration / 7);
});

//* DOCUMENT MIDDLEWARE: runs before .save() and .create() only
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function (next) {
//     console.log('Hello there');
//     next();
// });

// //* post middle ware would have access to the document coming from the pre middleware
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

//* QUERY MIDDLEWARE, listen to find request, and the this will refer to query
//? Regex not ^ means begins with
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.time = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.time} millisecond`);
    // console.log(docs);
    next();
});

//* AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
