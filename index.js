const express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , strategy = require(`${__dirname}/strategy.js`)
    , config = require('./config');

const app = express();

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use( strategy )

passport.serializeUser( (user, done) => {
    done(null, {
        id: user.id,
        displayName: user.displayName,
        nickname: user.nickname,
        email: user.email
    });
})

passport.deserializeUser( (obj, done) => {
    
    done(null, obj);
});

app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/me',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/me', (req, res, next) => {
    if( !req.user ) {
        res.redirect('/login')
        
    } else {
        res.status(200).send( JSON.stringify( req.user, null, 10 ))
    }
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );