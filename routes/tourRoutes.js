const express = require('express');
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
} = require('../controllers/tourController');

const router = express.Router();

//? Custom Route
router.route('/top-5-value').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
