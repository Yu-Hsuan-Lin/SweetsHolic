const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Restaurant = require('../models/restaurant');
const restaurants = require('../controllers/restaurants');
// const {restaurantSchema, reviewSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateRestaurant} = require('../middleware');
const multer = require('multer');
// don't have to /index, because node automatically looking for index.js file
const {storage} = require('../cloudinary');
const upload = multer({ storage });  // pass in place to uploqd ex.AWS, Cloudary

// to do "get" to this url
router.route('/')
    .get(catchAsync(restaurants.index)) 
    // upload.array('image'), validateRestaurant, this order is wierd, should be aware of
    .post(isLoggedIn, upload.array('image'), validateRestaurant, restaurants.createRestaurant);
    // upload.single('image') is for multer to parse and the param is the field(input name in form) it should be looking for
    // and multer will go and add the file attribute to the file and the rest of the body 
    // if use upload.array(): expect multiple files under the key name 'image'
        // if use upload.array(). those files will be stored on req.files


// have to put new in front of /:id, or will treat it as id and can't found. order matters.
router.get('/new', isLoggedIn, restaurants.renderNewForm);

router.route('/:id')
    .get((restaurants.showRestaurant))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateRestaurant, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm));

module.exports = router;