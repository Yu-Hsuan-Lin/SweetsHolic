// if in development mode (now)
// product: deploy
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
console.log("node env: ", process.env.NODE_ENV);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const restaurantsRoutes = require('./routes/restaurants');
const reviewsRoutes = require('./routes/reviews');

const MongoStore = require('connect-mongo');

//delpoy: const dbUrl = process.env.DB_URL;
//development: using local database: 'mongodb://localhost:27017/yummer'
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yummer';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Yummer Database connected");
})

const app = express();

// an engine used to run and parse and basically make sense of EJ's
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// ========I want to make it a var but failed ==================
// var store = MongoStore.create ({
//     url: dbUrl,
//     secret: 'secret',
//     touchAfter:  24 * 60 * 60// lazy update the session: update time period
// });

// app.use(session({
//     store: store
// }));
// store.on("error", function(e){
//     console.log("session store error", e)
// })
// ========I want to make it a var but failed ==================
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const sessionConfig = {
    store: MongoStore.create({ mongoUrl: dbUrl,
        secret: secret,
        touchAfter:  24 * 60 * 60}),
    secret: secret,
    resave: false,
    saveUnintialized: true,
    cookie: {
        // security
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// hi passport, we want you to use LocalStrategy that we downloaded and required
// and for that strategy, the authentication method is going to be located on our user model
passport.use(new LocalStrategy(User.authenticate()));
//serialization: how do we store user in the session
passport.serializeUser(User.serializeUser());
// how do you get the user out of the session 
passport.deserializeUser(User.deserializeUser());


// make a flash middleware before router
app.use((req, res, next) => {
    // these are global things, I have access to them every single template
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl; 
        console.log(req.session);
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/restaurants', restaurantsRoutes);
app.use('/restaurants/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh wrong!';
    res.status(statusCode).render('error', {err});
})

// set up server
app.listen(3000, () => {
    console.log('Serving on port 3000'); 
})