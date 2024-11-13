const express = require('express');
const path = require('path');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

// Serve static files (e.g., CSS, images)
app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

// Define routes to render specific pages
app.get('/home', (req, res) => {
    res.render('index'); // Render index.ejs for Home
});

app.get('/our_story', (req, res) => {
    res.render('our_story'); // Render our_story.ejs
});

app.get('/login_page', (req, res) => {
    res.render('login_page'); // Render login_page.ejs
});

app.get('/sign_up', (req, res) => {
    res.render('sign_up'); // Render sign_up.ejs
});

app.get('/contact_us', (req, res) => {
    res.render('contact_us_page'); // Render contact_us_page.ejs
});

app.get('/faqs', (req, res) => {
    res.render('faq_page'); // Render faq_page.ejs
});

app.get('/find', (req, res) => {
    res.render('find_backyard'); // Render find_backyard.ejs
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
