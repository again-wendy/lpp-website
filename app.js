require('dotenv').config();
const express           = require('express');
const bodyParser        = require('body-parser');
const exphbs            = require('express-handlebars');
const path              = require('path');
const i18n              = require('i18n-express');
const request           = require('request');
const flash             = require('express-flash');
const session           = require('express-session');
const nodemailer        = require('nodemailer');

const app = express();
const sessionStore = new session.MemoryStore;

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Session Middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    key: process.env.COOKIE_KEY,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));

// Setup language
app.use(i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ['en', 'nl'],
    textsVarName: 'tl'
}));

// Flash Middleware
app.use(flash());

// Settings for mail
const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    secure: false,
    port: 25,
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Set routes
app.get('/', (req, res) => {
    request('http://simplifyingpurchasing.com/wp-json/wp/v2/posts?_embed=true', (err, resp, body) => {
    var temp = JSON.parse(body) 
    temp = temp.slice(0, 4);   
    temp = getFeaturedImage(temp);
    res.render('home', {
            title: "LAKRAN Procurement Professionals",
            desc: "For more than 10 years LAKRAN Procurement Professionals has been supplying improvements in the procurement domain. We are a go-to advisory link between purchasing organizations and software houses that deliver procurement solutions.",
            blogs: temp
        });
    });
});

app.get('/strategy-as-a-service', (req, res) => {
    res.render('strategy', {
        title: "Strategy as a Service | LAKRAN",
        desc: "What do you have to focus on when you want to achieve specific objectives in the coming years?"
    });
});
app.get('/insights-as-a-service', (req, res) => {
    res.render('insights', {
        title: "Insights as a Service | LAKRAN",
        desc: "Our Procurement Control Room consists of a business intelligence platform (everything in the cloud, of course), in which we have combined our knowledge of data analysis and dashboarding."
    });
});
app.get('/solutioning-as-a-service', (req, res) => {
    res.render('solutioning', {
        title: "Solutioning as a Service | LAKRAN",
        desc: "Improve or replace existing software solutions? So many people, so many wishes, and that certainly applies where those people form organizations together."
    });
});
app.get('/management-as-a-service', (req, res) => {
    res.render('management', {
        title: "Management as a Service | LAKRAN",
        desc: "How should you actually manage \"continuous improvement\" within procurement?"
    });
});

app.get('/wow', (req, res) => {
    res.render('wowpage', {
        title: "LAKRAN presents WOW | LAKRAN",
        desc: "You may not hear it that often; Design Thinking in the procurement branch. Yet it adds a lot. Design Thinking is not only thinking, it is a mindset applied by our professional team."
    });
});

// Extended contactform
app.post('/contactform', (req, res) => {
    let output = `
        <h1>${req.body.names} heeft het contactformulier op SimplifyingPurchasing.com ingevuld!</h1>
        <h2>Details:</h2>
        <ul>
            <li>Voor- en achternaam: ${req.body.names}</li>
            <li>Email: <a href="mailto:${req.body.email}">${req.body.email}</a></li>
        </ul>
    `;

    let options = {
        from: '"Contactformulier Simplifying Purchasing" <info@lakran.com>',
        to: 'wendy.dimmendaal@again.nl',
        subject: 'Aanvraag voor contact',
        text: 'Test 123',
        html: output
    }

    if(req.body.url === "" && req.body.url.length == 0) {
        transporter.sendMail(options, (error, info) => {
            if(error) {
                req.flash('error', 'Something went wrong: ' + error);
            } else {
                req.flash('success', 'Je aanvraag is verzonden!');
                res.redirect(req.get('referer'));
            }
        });
    }
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