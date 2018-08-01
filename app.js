const express           = require('express');
const bodyParser        = require('body-parser');
const exphbs            = require('express-handlebars');
const path              = require('path');
const i18n              = require('i18n-express');

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
    res.render('home');
});

app.get('/strategy', (req, res) => {
    res.render('strategy');
});

// Startup server
var port =  3000;
app.listen(port, () => {
    console.log('Server started...');
});