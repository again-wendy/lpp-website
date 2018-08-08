const express           = require('express');
const bodyParser        = require('body-parser');
const exphbs            = require('express-handlebars');
const path              = require('path');
const i18n              = require('i18n-express');
const request           = require('request');

const app = express();

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Setup language
app.use(i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ['en', 'nl'],
    textsVarName: 'tl'
}));

// Set routes
app.get('/', (req, res) => {
    request('http://localhost:8888/newlpp/wp-json/wp/v2/posts?_embed=true', (err, resp, body) => {
    var temp = JSON.parse(body) 
    temp = temp.slice(0, 4);   
    temp = getFeaturedImage(temp);
    res.render('home', {
            blogs: temp
        });
    });
});

app.get('/strategy', (req, res) => {
    res.render('strategy');
});

// Get de latest four blogsposts from WordPress
app.get('/blogs', (req, res) => {
    request('http://localhost:8888/newlpp/wp-json/wp/v2/posts?_embed=true', (err, resp, body) => {
        res.send(JSON.parse(body));
    });
});

// Startup server
var port =  3000;
app.listen(port, () => {
    console.log('Server started...');
});

const getFeaturedImage = (arr) => {
    for(var i = 0; i < arr.length; i++) {
        var img = arr[i]._embedded['wp:featuredmedia'][0].source_url;
        arr[i].img = img;
    }
    return arr;
}