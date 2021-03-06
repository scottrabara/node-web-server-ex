const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//Need this for heroku
const port = process.env.PORT || 3000;


var app = express();

//Take directory you wanna use for html partials
hbs.registerPartials(__dirname + '/views/partials');
//Tell express that we will use Handlebars view engine
app.set('view engine', 'hbs');


// Middleware to keep track of server requests
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', `${now}: ${req.method} ${req.url}`, (e) => {
        if (e) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//under maintenance middleware
app.use((req, res, next) => {
    var maintenance = false;
    if (maintenance) {
        res.render('maintenance.hbs',{
            pageTitle: 'Under maintenance...'
        });
    }
    else {
        next();
    }
})

//enable static pages, this comes after maintenance
//so maintenance middleware can render before static pages
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

//Root directory
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Scott',
    //     likes: [
    //         'Guitar',
    //         'Phones'
    //     ]
    // })
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome, this is the home page!'
    });
});

//About page
app.get('/about', (req, res) => { 
    res.render('about.hbs', {
        pageTitle: 'About Page'
    })
});

//Projects page
app.get('/projects', (req, res) => { 
    res.render('projects.hbs', {
        pageTitle: 'Projects Page',
        welcomeMessage: 'Welcome, this is the projects page!'
    })
});

// route for /bad
// send back json with errorMessage
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: '400: Bad request'
    })
})


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});