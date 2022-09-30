const mongoose = require('mongoose');
const { restaurantSchema } = require('../schemas');
const review = require('./review');
const Schema = mongoose.Schema;

// the reson we use virtual is because we already have the image store in the database.
// we don't want to restore it. we just derive from the info we have already storing.
// we don't use it in other files so we don't exports it
const ImageSchema = new Schema({
    url: String,
    filename: String 
})

// virtual: reate property that we don't have to store in the database
ImageSchema.virtual('thumbnail').get(function () {
    // from cloudinary image transmission API
    return this.url.replace('/upload', '/upload/w_200');
});

// to include virtual will convert to JSON
const opts = { toJSON: { virtuals: true }};

const RestaurantSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: "String",
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,    
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

// virtual: reate property that we don't have to store in the database
RestaurantSchema.virtual('properties.popUpMarkup').get(function () {
    // from cloudinary image transmission API
    return `<strong><a href="/restaurants/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 30)}...</p>`;
});

RestaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);