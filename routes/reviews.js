const express = require('express');
// mergeParams to get param from app.js for :id
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const reviews = require('../controllers/reviews');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const {restaurantSchema, reviewSchema} = require('../schemas.js');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;