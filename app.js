const express           = require('express');
const bodyParser        = require('body-parser');
const exphbs            = require('express-handlebars');
const path              = require('path');

const app = express();

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set routes
app.get('/', (req, res) => {
    res.render('home');
});

// Startup server
var port =  3000;
app.listen(port, () => {
    console.log('Server started...');
});