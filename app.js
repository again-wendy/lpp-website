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
const cookieParser      = require('cookie-parser');

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

// Cookie Parser Middleware
app.use(cookieParser(process.env.SECRET_KEY));

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
    request('http://blog.simplifyingpurchasing.com/wp-json/wp/v2/posts?_embed=true&per_page=5', (err, resp, body) => {
    var temp = JSON.parse(body);
    temp = removeSorryPost(temp);  
    temp = temp.slice(0, 4);  
    temp = getFeaturedImage(temp);
    res.render('home', {
            title: "LAKRAN Procurement Professionals",
            desc: "For more than 10 years LAKRAN Procurement Professionals has been supplying improvements in the procurement domain. We are a go-to advisory link between purchasing organizations and software houses that deliver procurement solutions.",
            blogs: temp
        });
    });
});

// app.get('/blogs', (req, res) => {
//     request('http://blog.simplifyingpurchasing.com/wp-json/wp/v2/posts?_embed=true', (err, resp, body) => {
//         res.send(body);
//     });
// });

app.get('/strategy-as-a-service', (req, res) => {
    res.render('strategy', {
        title: "Strategy as a Service | LAKRAN",
        desc: "What do you have to focus on when you want to achieve specific objectives in the coming years?"
    });
});
app.get('/customer-case-strategy', (req, res) => {
    res.render('klant-strategy', {
        title: "Customer case Strategy as a  Service | LAKRAN",
        desc: ""
    });
});
app.get('/insights-as-a-service', (req, res) => {
    res.render('insights', {
        title: "Insights as a Service | LAKRAN",
        desc: "Our Procurement Control Room consists of a business intelligence platform (everything in the cloud, of course), in which we have combined our knowledge of data analysis and dashboarding."
    });
});
app.get('/customer-case-insights', (req, res) => {
    res.render('klant-insights', {
        title: "Customer case Insights as a Service | LAKRAN",
        desc: "Within our Insights proposition we do nice, beautiful things for our customers. Curious about our added value?"
    });
});
app.get('/solutioning-as-a-service', (req, res) => {
    res.render('solutioning', {
        title: "Solutioning as a Service | LAKRAN",
        desc: "Improve or replace existing software solutions? So many people, so many wishes, and that certainly applies where those people form organizations together."
    });
});
app.get('/customer-case-solutioning', (req, res) => {
    res.render('klant-solutioning', {
        title: "Customer case Solutioning as a Service | LAKRAN",
        desc: ""
    });
});
app.get('/management-as-a-service', (req, res) => {
    res.render('management', {
        title: "Management as a Service | LAKRAN",
        desc: "How should you actually manage \"continuous improvement\" within procurement?"
    });
});
app.get('/customer-case-management', (req, res) => {
    res.render('klant-management', {
        title: "Customer case Management as a Service | LAKRAN",
        desc: ""
    });
});

app.get('/core-values', (req, res) => {
    res.render('corevalues', {
        title: "Core values | LAKRAN",
        desc: "The core values of LAKRAN Procurement Professionals"
    });
});

app.get('/wow', (req, res) => {
    res.render('wowpage', {
        title: "LAKRAN presents WOW | LAKRAN",
        desc: "You may not hear it that often; Design Thinking in the procurement branch. Yet it adds a lot. Design Thinking is not only thinking, it is a mindset applied by our professional team."
    });
});
app.get('/roadmap', (req, res) => {
    res.render('roadmap', {
        title: "Roadmap WOW | LAKRAN",
        desc: "Our roadmap to the Way of Working of LAKRAN",
        step: req.query.step
    })
});

// Extended contactform
app.post('/contactform', (req, res) => {
    let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + process.env.RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;

    let output = `
        <h2>${req.body.names} heeft het contactformulier op SimplifyingPurchasing.com ingevuld!</h2>
        <h3>Details:</h3>
        <ul>
            <li>Voor- en achternaam: ${req.body.names}</li>
            <li>Email: <a href="mailto:${req.body.email}">${req.body.email}</a></li>
            <li>Telefoon: ${req.body.phone}</li>
            <li>Taal: ${req.cookies.ulang}</li>
        </ul>
    `;

    let options = {
        from: '"Contactformulier Simplifying Purchasing" <info@lakran.com>',
        to: 'doede.van.haperen@lakran.com',
        //to: 'wendy.dimmendaal@again.nl',
        subject: 'Aanvraag voor contact',
        text: 'Test 123',
        html: output
    }

    request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            if(req.cookies.ulang == "nl") {
                req.flash('error', 'Er is iets mis gegaan met de recaptcha: ' + error);
            } else {
                req.flash('error', 'Something went wrong with recaptcha: ' + error);
            }
            res.redirect(req.get('referer') + "#contact-extended");
        } else {
            transporter.sendMail(options, (errorMail, info) => {
                if(errorMail) {
                    if(req.cookies.ulang == "nl") {
                        req.flash('error', 'Er is iets mis gegaan met het verzenden van de email: ' + errorMail)
                    } else {
                        req.flash('error', 'Something went wrong with sending the email: ' + errorMail);
                    }
                    res.redirect(req.get('referer') + "#contact-extended");
                } else {
                    req.flash('success', 'Thanks for the message! We\'ll be in touch');
                    res.redirect(req.get('referer') + "#contact-extended");
                }
            });
        }
    });
});

// Request for whitepapers
// P2P Dashboarding en BI-trends
app.post('/get-dashboarding-whitepaper', (req, res) => {
    if(req.cookies.ulang == "nl") {
        output = `
            <h1>Hier is je whitepaper!</h1>
            <p>Je hebt op de LAKRAN Procurement Professionals website een whitepaper aangevraagd. Hij zit als bijlage bij deze mail!</p>
            <p>Heb je nog vragen? Neem gerust contact met ons op!</p>
        `;
        pathBook = './public/files/whitepaper-dashboarding-nl.pdf';
    } else {
        output = `
            <h1>Here is your whitepaper!</h1>
            <p>You've requested on the LAKRAN Procurement Professionals website a whitepaper. You can find it as an attachment!</p>
            <p>Any questions? Don't hesitate to contact us!</p>
        `;
        pathBook = './public/files/whitepaper-dashboarding-en.pdf';
    }

    let helperOptions = {
        from: '"Doede van Haperen" <doede.van.haperen@lakran.com>',
        to: req.body.email,
        subject: "LAKRAN Whitepaper",
        text: "",
        html: output,
        attachments: [
            {
                path: pathBook
            }
        ]
    }

    if(req.body.url === "" && req.body.url.length == 0) {
        transporter.sendMail(helperOptions, (error, info) => {
            if(error) {
                req.flash('error', 'Something went wrong: ' + error);
            } else {
                req.flash('success', 'You can find your whitepaper in your mailbox!');
                res.redirect(req.get('referer') + '#whitepapers');
            }
        });
        sendMailLakran("P2P Dashboarding", req.body.email);
    }
});

// Een transitie naar Fiori, ervaringen en tips
app.post('/get-fiori-whitepaper', (req, res) => {
    if(req.cookies.ulang == "nl") {
        output = `
            <h1>Hier is je whitepaper!</h1>
            <p>Je hebt op de LAKRAN Procurement Professionals website een whitepaper aangevraagd. Hij zit als bijlage bij deze mail!</p>
            <p>Heb je nog vragen? Neem gerust contact met ons op!</p>
        `;
        pathBook = './public/files/whitepaper-fiori-nl.pdf';
    } else {
        output = `
            <h1>Here is your whitepaper!</h1>
            <p>You've requested on the LAKRAN Procurement Professionals website a whitepaper. You can find it as an attachment!</p>
            <p>Any questions? Don't hesitate to contact us!</p>
        `;
        pathBook = './public/files/whitepaper-fiori-en.pdf';
    }

    let helperOptions = {
        from: '"Doede van Haperen" <doede.van.haperen@lakran.com>',
        to: req.body.email,
        subject: "LAKRAN Whitepaper",
        text: "",
        html: output,
        attachments: [
            {
                path: pathBook
            }
        ]
    }

    if(req.body.url === "" && req.body.url.length == 0) {
        transporter.sendMail(helperOptions, (error, info) => {
            if(error) {
                req.flash('error', 'Something went wrong: ' + error);
            } else {
                req.flash('success', 'You can find your whitepaper in your mailbox!');
                res.redirect(req.get('referer') + '#whitepapers');
            }
        });
        sendMailLakran("Fiori", req.body.email);
    }
});

const sendMailLakran = (subject, email) => {
    let output = `
        <p>${email} heeft de ${subject} whitepaper aangevraagd!</p>
    `;

    let helperOptions = {
        from: '"LAKRAN Procurement Professionals" <info@lakran.com>',
        to: "doede.van.haperen@lakran.com",
        subject: "LAKRAN Whitepaper download",
        text: "",
        html: output
    }

    transporter.sendMail(helperOptions);
}

// Fallback for wrong urls
app.get('*', (req, res) => {
    res.render('404', {
        title: "Page not found",
        desc: "404: page not found"
    });
});

// Startup server
var port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started...');
});

const getFeaturedImage = (arr) => {
    for(var i = 0; i < arr.length; i++) {
        if( arr[i]._embedded['wp:featuredmedia'] != undefined ) {
            var img = arr[i]._embedded['wp:featuredmedia'][0].source_url;
            arr[i].img = img;
        } else {
            arr[i].img = "./public/images/imgplaceholder.png";
        }
    }
    return arr;
}

const removeSorryPost = (arr) => {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].id === 11344) {
            arr.splice(i, 1);
        }
    }
    return arr;
}