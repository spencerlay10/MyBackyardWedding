//Izzy Turner, Spencer Layton, Channing Paxman, and Rachel Serre Section 002 Group 2-1

// Import required libraries 
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const knex = require("knex");

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key', // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
  }));

// Serve static files (e.g., CSS, images)
app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

// Configure and connect to PostgreSQL database using 'knex'
const db = knex({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "postgres",
        password: process.env.RDS_PASSWORD || "admin",
        database: process.env.RDS_DB_NAME || "myBackyardWedding",
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
    },
    useNullAsDefault: false
});

app.get('/', (req, res) => {
    res.render('index'); // This will look for 'our_story.ejs' in the 'views' folder
  });

app.get('/our_story', (req, res) => {
    res.render('our_story'); // Render our_story.ejs
});

app.get('/login_page', (req, res) => {
    res.render('login_page'); // Render login_page.ejs
});

app.get('/signup_page', (req, res) => {
    res.render('signup_page'); // Render sign_up.ejs
});

app.get('/contact_us_page', (req, res) => {
    res.render('contact_us_page'); // Render contact_us_page.ejs
});

app.get('/faq_page', (req, res) => {
    res.render('faq_page'); // Render faq_page.ejs
});

app.get('/find_a_backyard', (req, res) => {
    res.render('find_a_backyard'); // Render find_a_backyard.ejs
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db('owners')
            .select('*')
            .where({ owner_email: email, owner_password: password })
            .first(); // Fetch a single user record

        if (user) {
            // Store user info in session
            req.session.loggedIn = true;
            req.session.email = email;

            // Redirect to the admin page
            res.redirect('/admin');
        } else {
            res.send('Invalid email or password. Please try again.');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal server error.');
    }
});

  
// Admin page (protected route)
app.get('/admin', (req, res) => {
    if (req.session.loggedIn) {
        res.render('admin', { email: req.session.email }); // Pass the user's email to the admin view
    } else {
        res.status(403).send('Access denied. Please log in.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/login_page');
    });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
