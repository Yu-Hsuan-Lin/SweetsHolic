const mongoose = require('mongoose');
const cities = require('./cities');
const Restaurant = require('../models/restaurant');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yummer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Yummer index Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(8 + Math.random() * 30);
        const rest = new Restaurant({
            // your user id
            author: '62f5e12d5e64e4bce5bb166d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. At molestias omnis voluptatibus expedita maiores commodi optio, porro, officiis cum facilis laboriosam et perferendis alias ad ipsum id culpa eaque minima.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dcnmmnmfw/image/upload/v1660442949/SweetsHolic/y9pemglwygnkksxyhpj1.png',
                  filename: 'SweetsHolic/y9pemglwygnkksxyhpj1',
                },
                {
                  url: 'https://res.cloudinary.com/dcnmmnmfw/image/upload/v1660442949/SweetsHolic/s0gvbux93syskxgnn3jn.png',
                  filename: 'SweetsHolic/s0gvbux93syskxgnn3jn',
                }
              ]
        })
        await rest.save();
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})
